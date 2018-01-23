#!/usr/bin/env node

/*

 Requests some default sites, so they are cached

 */

const fs = require('fs');
const path = require('path');
const async = require('async');
const request = require('request');
const config = require('../config.js');

let data_folder = config.server.data.path;
if (config.server.data.path[0] === '.') {
	data_folder = path.resolve(__dirname, '..', config.server.data.path);
}
let portals = JSON.parse(fs.readFileSync(path.join(data_folder, 'portals.json')).toString());
let routes = JSON.parse(fs.readFileSync(path.join('../src/app/model', 'routes.json')).toString()).routes;
let languages = JSON.parse(fs.readFileSync(path.join('../src/i18n', 'languages.json')).toString()).enabled;

let sites = [];

routes.forEach(route => {
	if (route.rootHTML5 || route.rootMenu) {
		sites.push('/' + route.path);
	}
	if (route.children) {
		route.children.forEach(sub => {
			sites.push('/' + route.path + '/' + sub.path);
		});
	}
});

let warm_site = (portal, site, lang, cb) => {
	let url = 'http://' + config.server.listen.host + ':' + config.server.listen.port + '/' + portal.id.toLowerCase() + site + (lang.id !== 'en' ? '?lang=' + lang.id : '');
	console.time(url);
	request(url, {timeout: 300000}, (error, response, body) => {
		console.timeEnd(url);
		if (error) console.log(error);
		cb();
	});
};

let warm_sites = (cb) => {
	async.forEachSeries(languages, (lang, nextlang) => {
		async.forEachSeries(portals, (portal, nextportal) => {
			async.forEachSeries(sites, (site, nextsite) => {
				warm_site(portal, site, lang, nextsite);
			}, nextportal);
		}, nextlang);
	}, cb);
};

warm_sites(() => {
	console.log('done');
});
