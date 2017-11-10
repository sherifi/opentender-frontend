// polyfills for the server
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as request from 'request';
import * as cache from 'memory-cache';
import * as geoip from 'geoip-ultralight';
import * as helmet from 'helmet';

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

import * as Config from 'config.js';
import {routes} from '../app/app.routes';

let portals = JSON.parse(fs.readFileSync(path.join(Config.server.data.path, 'portals.json')).toString());

let useCache = !Config.server.disableCache;
let addToCache = (req, data) => {
	if (!useCache) {
		return;
	}
	let url = req.originalUrl + '|' + JSON.stringify(req.body);
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
	let url = req.originalUrl + '|' + JSON.stringify(req.body);
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
const DATA = (Config.server.data.path[0] === '.') ? path.join(path.resolve(__dirname, '..', '..', Config.server.data.path)) : Config.server.data.path;
const ROOT = path.join(path.resolve(__dirname, '../../assets'));
const DIST = path.join(path.resolve(__dirname, '../../dist/client'));
const DIST_STYLE = path.join(path.resolve(__dirname, '../../dist/style'));
const VIEWS = path.join(path.resolve(__dirname, '../views'));
const VIEW = path.join(VIEWS, 'index.html');
const RES_VERSION = Config.client.version.replace(/\./g, '');

let errorResponse = (req, res) => {
	return res.status(404).type('txt').send('Not found ' + req.url);
};

app.use(helmet());
app.engine('.html', ngExpressEngine({}));
app.set('views', VIEWS);
app.set('view engine', 'html');

app.use('/robots.txt', express.static(path.join(ROOT, '/robots.txt')));
app.use('/favicon.ico', express.static(path.join(ROOT, '/favicons/favicon.ico')));
app.use('/assets/js', express.static(DIST, {index: false}));
app.use('/assets/style', express.static(DIST_STYLE, {index: false}));
app.use('/assets/lang/:id', (req, res) => {
	if (!languages[req.params.id]) {
		return res.sendStatus(404);
	}
	res.send(languages[req.params.id].translation);
});
app.use('/data/schema.json', express.static(path.join(DATA, '/schema.json')));
app.use('/data/nuts0.geo.json', express.static(path.join(DATA, '/nuts/nuts_20M_lvl0.geo.json')));
app.use('/data/nuts1.geo.json', express.static(path.join(DATA, '/nuts/nuts_20M_lvl1.geo.json')));
app.use('/data/nuts2.geo.json', express.static(path.join(DATA, '/nuts/nuts_20M_lvl2.geo.json')));
app.use('/data/nuts3.geo.json', express.static(path.join(DATA, '/nuts/nuts_20M_lvl3.geo.json')));
app.use('/data/files', express.static(path.join(DATA, '/downloads'), {index: false}));
app.use('/data/files', errorResponse);
app.use('/data', errorResponse);
app.use('/assets', express.static(ROOT, {index: false}));
app.use('/assets', errorResponse);

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

let render = function(req, res, language, country) {
	let engine = ngExpressEngine({
		bootstrap: language.module,
		providers: [
			{provide: 'isBrowser', useValue: false},
			{provide: 'absurl', useValue: 'http://' + Config.server.listen.host + ':' + Config.server.listen.port},
			{provide: 'opentender', useValue: {locale: language.lang, config: Config.client, country: country}}
		],
		languageProviders: [
			{provide: TRANSLATIONS, useValue: language.translation || ''},
			{provide: TRANSLATIONS_FORMAT, useValue: 'xlf'},
			{provide: LOCALE_ID, useValue: language.lang}
		],
		prepareHTML: (html) => {
			return html.replace(/\{\{BASE_HREF\}\}/g, (country.id ? '/' + country.id : '') + '/')
				.replace(/\{\{COUNTRY_NAME\}\}/g, country.id ? country.name : '')
				.replace(/\{\{HTML_LANG\}\}/g, language.lang)
				.replace(/\{\{FULL_URL\}\}/g, Config.server.fullUrl)
				.replace(/\{\{RES_VERSION\}\}/g, RES_VERSION)
				.replace(/\{\{OPENTENDER\}\}/g, JSON.stringify({locale: language.lang, config: Config.client, country: country}));
		}
	});
	console.time(`GET: ${req.originalUrl}`);
	return engine(VIEW, {req: req, res: res}, (err?: Error | null, html?: string) => {
		console.timeEnd(`GET: ${req.originalUrl}`);
		if (err !== null || !html) {
			console.log('err', err, html);
			return res.status(500).send('<html><body>Software Failure. Guru Meditation.<br/>Please reload the page.' + (Config.client.devMode ? '<br/><br/><pre>' + err.stack + '</pre>' : '') + '</body></html>');
		}
		return sendAndAddToCache(req, res, html);
	});
};

let startApp = function(req, res) {
	let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	let c_id = geoip.lookupCountry(ip);
	let ip_country = null;
	if (c_id) {
		c_id = c_id.toLowerCase();
		if (c_id === 'gb') {
			c_id = 'uk';
		}
		ip_country = portals.filter(portal => portal.id == c_id)[0];
		if (ip_country) {
			ip_country = {id: ip_country.id, name: ip_country.name};
		}
	}
	let country = {id: null, name: 'Portals', ip: ip_country};
	req.originalUrl = '/start';
	render(req, res, getLang(req), country);
};

let getLang = function(req) {
	let lang = languages[req.query.lang];
	return lang || languages['en'];
};

let portalApp = function(req, res, country) {
	render(req, res, getLang(req), country);
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
		let url = (req.originalUrl || '').split('?')[0];
		if ([country_path, country_path + '/', country_path + '/index.html'].indexOf(url) < 0) {
			return errorResponse(req, res);
		} else {
			return ngApp(req, res);
		}
	});
};

portals.forEach(portal => {
	if (portal.id) {
		registerPages(portal);
	}
});

app.use('/start*', startApp);
app.use('/', (req, res) => {
	let url = (req.originalUrl || '').split('?')[0];
	if (['/', '/index.html'].indexOf(url) < 0) {
		return errorResponse(req, res);
	} else {
		return startApp(req, res);
	}
});

app.use(errorResponse);

const listener = app.listen(Config.server.listen.port, Config.server.listen.host, () => {
	console.log('Opentender Portal is listening on: http://%s:%d (%s)', listener.address().address, listener.address().port, app.settings.env);
});
