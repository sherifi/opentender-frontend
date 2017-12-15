// polyfills for the server
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as request from 'request';
import * as geoip from 'geoip-ultralight';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as crypto from 'crypto';

import {enableProdMode} from '@angular/core';
import {ngExpressEngine} from './express-engine/main';
import {initCache} from './cache';
import {TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID} from '@angular/core';

import * as Config from 'config.js';
import {routes} from '../app/app.routes';

let portals = JSON.parse(fs.readFileSync(path.join(Config.server.data.path, 'portals.json')).toString());

let md5hash = (value: string) => {
	return crypto.createHash('md5').update(value).digest('hex');
};

let getCacheKey = (req) => {
	let key = JSON.stringify({u: req.originalUrl, b: req.body, p: req.params});
	return md5hash(key);
};

const cache = initCache(Config.server.cache);
let addToCache = (req, data) => {
	cache.upsert(getCacheKey(req), data, err => {
		if (err) {
			console.log(err);
		}
	});
};
let sendAndAddToCache = (req, res, data) => {
	addToCache(req, data);
	return res.send(data);
};
let checkCache = (req, res, cb) => {
	cache.get(getCacheKey(req), (err, data) => {
		if (data) {
			req.cached = true;
			res.send(data);
		} else {
			cb();
		}
	});
};

enableProdMode();

const app = express();
const DATA = (Config.server.data.path[0] === '.') ? path.join(path.resolve(__dirname, '..', '..', Config.server.data.path)) : Config.server.data.path;
const I18N = path.join(path.resolve(__dirname, '../../src/i18n'));
const ROOT = path.join(path.resolve(__dirname, '../../assets'));
const DIST = path.join(path.resolve(__dirname, '../../dist/client'));
const DIST_STYLE = path.join(path.resolve(__dirname, '../../dist/style'));
const VIEWS = path.join(path.resolve(__dirname, '../views'));
const VIEW = path.join(VIEWS, 'index.html');
const RES_VERSION = Config.client.version.replace(/\./g, '');

import {MainModule} from './main.module';

let languages = JSON.parse(fs.readFileSync(path.resolve(I18N, 'languages.json')).toString()).enabled;

let translations = {
	'en': {lang: 'en', translation: null, extra: {}}
};

languages.forEach(lang => {
	if (lang.id !== 'en') {
		let specials = {};
		portals.forEach(portal => {
			if (['all', 'eu'].indexOf(portal.id) >= 0) {
				specials[portal.id] = portal.names[lang.id];
			}
		});
		translations[lang.id] = {
			lang: lang.id,
			translation: fs.readFileSync(path.resolve(I18N, 'language.' + lang.id + '.xlf')).toString(),
			extra: {
				countries: JSON.parse(fs.readFileSync(path.resolve(DATA, 'country-names/' + lang.id + '.json')).toString()),
				portals: specials
			}
		};
	}
});

let errorResponse = (req, res) => {
	return res.status(404).type('txt').send('Not found ' + req.url);
};

morgan.token('cached', (req) => {
	return req.cached ? 'true' : 'false';
});
app.use(morgan('[:date[clf]] - cached: :cached - :method :url - :res[content-length] - :response-time ms',
	{
		skip: (req, res) => {
			return (req.originalUrl.indexOf('/assets') === 0);
		}
	}
));

app.use(helmet());
app.engine('.html', ngExpressEngine({}));
app.set('views', VIEWS);
app.set('view engine', 'html');

app.use('/robots.txt', express.static(path.join(ROOT, '/robots.txt')));
app.use('/favicon.ico', express.static(path.join(ROOT, '/favicons/favicon.ico')));
app.use('/assets/js', express.static(DIST, {index: false}));
app.use('/assets/style', express.static(DIST_STYLE, {index: false}));
app.use('/assets/lang/:id', (req, res) => {
	if (!translations[req.params.id]) {
		return res.sendStatus(404);
	}
	res.send({translations: translations[req.params.id].translation, extra: translations[req.params.id].extra});
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
	let name = country.name;
	if (country.id && language.lang !== 'en') {
		name = country.names[language.lang] || country.name;
	}
	country = {id: country.id, name: name, foi: country.foi, ip: country.ip};
	let engine = ngExpressEngine({
		id: language.lang,
		bootstrap: MainModule,
		providers: [
			{provide: 'isBrowser', useValue: false},
			{provide: 'absurl', useValue: 'http://' + Config.server.listen.host + ':' + Config.server.listen.port},
			{provide: 'opentender', useValue: {locale: language.lang, config: Config.client, country: country}}
		],
		languageProviders: [
			{provide: 'TRANSLATIONS_EXTRA', useValue: language.extra},
			{provide: TRANSLATIONS, useValue: language.translation || ''},
			{provide: TRANSLATIONS_FORMAT, useValue: 'xlf'},
			{provide: LOCALE_ID, useValue: language.lang}
		],
		prepareHTML: (html) => {
			if (Config.client.devMode) {
				let pos1 = html.indexOf('<!-- Piwik -->');
				let pos2 = html.indexOf('<!-- End Piwik Code -->');
				html = html.slice(0, pos1) + html.slice(pos2);
			}
			let opts = {
				locale: language.lang,
				config: Config.client,
				country: country
			};
			return html.replace(/\{\{BASE_HREF\}\}/g, (country.id ? '/' + country.id : '') + '/')
				.replace(/\{\{COUNTRY_NAME\}\}/g, country.id ? name : '')
				.replace(/\{\{HTML_LANG\}\}/g, language.lang)
				.replace(/\{\{FULL_URL\}\}/g, Config.server.fullUrl)
				.replace(/\{\{RES_VERSION\}\}/g, RES_VERSION)
				.replace(/\{\{OPENTENDER\}\}/g, JSON.stringify(opts));
		}
	});
	return engine(VIEW, {req: req, res: res}, (err?: Error | null, html?: string) => {
		if (err !== null || !html) {
			console.log('err', err, html);
			return res.status(500).send('<html><body>Software Failure. Guru Meditation.<br/>Please reload the page.' + (Config.client.devMode ? '<br/><br/><pre>' + err.stack + '</pre>' : '') + '</body></html>');
		}
		return sendAndAddToCache(req, res, html);
	});
};

let startApp = function(req, res, originalUrl) {
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
	req.originalUrl = originalUrl;
	render(req, res, getLang(req), country);
};

let getLang = function(req) {
	let lang = translations[req.query.lang];
	return lang || translations['en'];
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

app.use('/start*', (req, res) => {
	startApp(req, res, '/start');
});
app.use('/imprint*', (req, res) => {
	startApp(req, res, '/imprint');
});
app.use('/', (req, res) => {
	let url = (req.originalUrl || '').split('?')[0];
	if (['/', '/index.html'].indexOf(url) < 0) {
		return errorResponse(req, res);
	} else {
		return startApp(req, res, '/start');
	}
});

app.use(errorResponse);

const listener = app.listen(Config.server.listen.port, Config.server.listen.host, () => {
	console.log('Opentender Portal is listening on: http://%s:%d (%s)', listener.address().address, listener.address().port, app.settings.env);
});
