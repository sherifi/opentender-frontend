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
if (config.server.data.path[0] == '.') {
	data_folder = path.resolve(__dirname, '..', config.server.data.path);
}
let portals = JSON.parse(fs.readFileSync(path.join(data_folder, 'portals.json')).toString()).active;
let sites = ['/', '/search/tender', '/search/company', '/search/authority', '/dashboards/corruption-indicators', '/dashboards/administrative-quality'];

let warm_site = (site, cb) => {
	async.forEachSeries(portals, (portal, next) => {
		let url = 'http://' + config.server.listen.host + ':' + config.server.listen.port + '/' + portal.id.toLowerCase() + site;
		console.log(url);
		request(url, {timeout: 300000}, (error, response, body) => {
			if (error) console.log(error);
			next();
		});
	}, cb);
};


async.forEachSeries(sites, warm_site, () => {
	console.log('done');
});
