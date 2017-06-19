// polyfills for the server
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as request from 'request';
import * as cache from 'memory-cache';
import * as geoip from 'geoip-ultralight';

import {enableProdMode} from '@angular/core';
import {ngExpressEngine} from './express-engine/main';

import {TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID} from '@angular/core';
import {TRANSLATION_DE} from '../i18n/messages.de';
import {TRANSLATION_ES} from '../i18n/messages.es';

import {MainModuleEN, MainModuleDE, MainModuleES} from './main.module';

// Modules are cached by universal, so trick it & and provide "different" modules
let languages = {
	'en': {lang: 'en', translation: null, module: MainModuleEN},
	'de': {lang: 'de', translation: TRANSLATION_DE, module: MainModuleDE},
	'es': {lang: 'es', translation: TRANSLATION_ES, module: MainModuleES}
};

import * as Portals from 'portals.json';
import * as Config from 'config.js';
import {routes} from '../app/app.routes';

let useCache = !Config.server.disableCache;
let addToCache = (req, data) => {
	if (!useCache) {
		return;
	}
	let url = req.originalUrl + '?' + JSON.stringify(req.body);
	let c = cache.get(url);
	if (!c) {
		cache.put(url, {url: url, data: data}, 60 * 60 * 1000);
	}
};
let sendAndAddToCache = (req, res, data) => {
	addToCache(req, data);
	return res.send(data);
};
let checkCache = (req, res, cb) => {
	if (!useCache) {
		return cb();
	}
	let url = req.originalUrl + '?' + JSON.stringify(req.body);
	let c = cache.get(url);
	if (c) {
		// console.log('request found in cache', url);
		res.send(c.data);
	} else {
		// console.log('request NOT found in cache', url);
		cb();
	}
};

enableProdMode();

const app = express();
const DATA = path.join(path.resolve(__dirname, Config.server.data.path));
const ROOT = path.join(path.resolve(__dirname, '../../assets'));
const DIST = path.join(path.resolve(__dirname, '../../dist/client'));
const DIST_STYLE = path.join(path.resolve(__dirname, '../../dist/style'));
const VIEWS = path.join(path.resolve(__dirname, '../views'));
const VIEW = path.join(VIEWS, 'index.html');
const RES_VERSION = Config.client.version.replace(/\./g, '');

let errorResponse = (req, res) => {
	return res.status(404).type('txt').send('Not found ' + req.url);
};

app.engine('.html', ngExpressEngine({}));
app.set('views', VIEWS);
app.set('view engine', 'html');

app.use('/robots.txt', express.static(path.join(ROOT, '/robots.txt')));
app.use('/favicon.ico', express.static(path.join(ROOT, '/favicons/favicon.ico')));
app.use('/assets/schema.json', express.static(path.join(DATA, '/schema.json')));
app.use('/assets/js', express.static(DIST, {index: false}));
app.use('/assets/style', express.static(DIST_STYLE, {index: false}));
app.use('/assets', express.static(ROOT, {index: false}));
app.use('/assets', errorResponse);
app.use('/files', express.static(path.join(DATA, '/downloads'), {index: false}));
app.use('/files', errorResponse);

app.use('/api*', (req, res) => {
	try {
		let reply = request(Config.server.backendUrl + req.baseUrl);
		req.pipe(reply);
		reply.pipe(res);
	} catch (err) {
		console.log('api redirect err', err);
		res.sendStatus(500);
	}
});


app.use(cookieParser('OpenTenderPortal'));
app.use(bodyParser.json());

let startApp = function(req, res) {
	let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	let c_id = geoip.lookupCountry(ip);
	let ip_country = null;
	if (c_id) {
		c_id = c_id.toLowerCase();
		if (c_id === 'gb') {
			c_id = 'uk';
		}
		ip_country = Portals.active.filter(portal => portal.id == c_id)[0];
		if (ip_country) {
			ip_country = {id: ip_country.id, name: ip_country.name};
		}
	}
	let country = {id: null, name: 'Portals', ip: ip_country};
	let language = languages['en'];
	let engine = ngExpressEngine({
		bootstrap: language.module,
		providers: [
			{provide: 'absurl', useValue: 'http://' + Config.server.listen.host + ':' + Config.server.listen.port},
			{provide: 'COUNTRY', useValue: country},
			{provide: TRANSLATIONS, useValue: language.translation || ''},
			{provide: TRANSLATIONS_FORMAT, useValue: 'xlf'},
			{provide: LOCALE_ID, useValue: language.lang}
		],
		prepareHTML: (html) => {
			return html.replace(/\{\{BASE_HREF\}\}/g, '/')
				.replace(/\{\{COUNTRY_NAME\}\}/g, '')
				.replace(/\{\{RES_VERSION\}\}/g, RES_VERSION)
				.replace(/\{\{LANG\}\}/g, language.lang)
				.replace(/\{\{COUNTRY\}\}/g, JSON.stringify(country));
		}
	});
	req.originalUrl = '/start';
	console.time(`GET: ${req.originalUrl}`);
	engine(VIEW, {req: req, res: res}, (status: number, body?: any) => {
		console.timeEnd(`GET: ${req.originalUrl}`);
		if (status !== null || !body) {
			console.log('err', status, body);
			return res.status(500).send('There is an error in error land…');
		}
		return res.status(200).send(body);
	});
};

let portalApp = function(req, res, country) {
	// let language = languages[country.id || 'en'];
	let language = languages['en'];
	let engine = ngExpressEngine({
		bootstrap: language.module,
		providers: [
			{provide: 'absurl', useValue: 'http://' + Config.server.listen.host + ':' + Config.server.listen.port},
			{provide: 'COUNTRY', useValue: {id: country.id, name: country.name}},
			{provide: TRANSLATIONS, useValue: language.translation || ''},
			{provide: TRANSLATIONS_FORMAT, useValue: 'xlf'},
			{provide: LOCALE_ID, useValue: language.lang}
		],
		prepareHTML: (html) => {
			return html.replace(/\{\{BASE_HREF\}\}/g, (country.id ? '/' + country.id : '') + '/')
				.replace(/\{\{COUNTRY_NAME\}\}/g, country.name)
				.replace(/\{\{RES_VERSION\}\}/g, RES_VERSION)
				.replace(/\{\{LANG\}\}/g, language.lang)
				.replace(/\{\{COUNTRY\}\}/g, JSON.stringify({id: country.id, name: country.name}));
		}
	});
	console.time(`GET: ${req.originalUrl}`);
	return engine(VIEW, {req: req, res: res}, (status: number, body?: any) => {
		console.timeEnd(`GET: ${req.originalUrl}`);
		if (status !== null || !body) {
			console.log('err', status, body);
			return res.status(500).send('There is an error in error land…');
		}
		return sendAndAddToCache(req, res, body);
	});
};

let registerPages = country => {
	let country_path = country.id ? '/' + country.id : '';

	let ngApp = (req, res) => {
		return portalApp(req, res, country);
	};

	// Routes with html5pushstate
	routes.forEach(route => {
		let s = route.path.split('/')[0];
		if (s && s !== '' && s !== '**') {
			app.use(country_path + '/' + s + '*', checkCache, ngApp);
		}
	});
	app.use(country_path + '/', checkCache, (req, res) => {
		if ([country_path, country_path + '/', country_path + '/index.html'].indexOf(req.originalUrl) < 0) {
			return errorResponse(req, res);
		} else {
			return ngApp(req, res);
		}
	});
};

Portals.active.forEach(portal => {
	if (portal.id) {
		registerPages(portal);
	}
});

app.use('/start*', startApp);
app.use('/', (req, res) => {
	if (['/', '/index.html'].indexOf(req.originalUrl) < 0) {
		return errorResponse(req, res);
	} else {
		return startApp(req, res);
	}
});

app.use(errorResponse);

const listener = app.listen(Config.server.listen.port, Config.server.listen.host, () => {
	console.log('Opentender Portal is listening on: http://%s:%d (%s)', listener.address().address, listener.address().port, app.settings.env);
});
