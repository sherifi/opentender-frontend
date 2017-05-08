#!/usr/bin/env node

/*

	Creates/Updates the language translation files
    based on code from angularCLI

	Copies the app to a temp folder, runs ngi8n on it, removes the temp folder
	then updates existing translations

    read more:
    https://github.com/angular/angular/blob/master/aio/content/guide/i18n.md

*/

require('reflect-metadata');
const compiler = require('@angular/compiler');
const tsc = require('@angular/tsc-wrapped');
const extractor_1 = require('@angular/compiler-cli/src/extractor');
const fs = require('fs-extra');
const async = require('async');
const path = require('path');
const XMLLite = require('xml-lite');

/*************************************
 * Constants
 *************************************/
const source = path.join(__dirname, '..');
const dest = path.join(__dirname, '..', 'dist', 'temp');
const source_messages_path = path.join(source, 'src', 'i18n');
const source_message = path.join(source, 'src', 'i18n', 'messages.xlf');

function copyArray(source) {
	let copy = [];
	for (elem of source) {
		copy.push(elem);
	}
	return copy;
}

let removeDest = function () {
	if (dest.length > 3) {
		console.log('removing dest', dest);
		fs.removeSync(dest);
	}
};

let runNGi18n = function (cb) {
	removeDest();
	console.log('copy project files to', dest);
	// fs.copySync(path.join(source, 'node_modules'), path.join(dest, 'node_modules'));
	fs.copySync(path.join(source, 'src'), path.join(dest, 'src'));
	fs.copySync(path.join(source, 'tsconfig.json'), path.join(dest, 'tsconfig.json'));
	fs.copySync(path.join(source, 'tslint.json'), path.join(dest, 'tslint.json'));
	fs.copySync(path.join(source, 'config.js'), path.join(dest, 'config.js'));
	fs.copySync(path.join(source, 'webpack.config.js'), path.join(dest, 'webpack.config.js'));
	fs.removeSync(path.join(dest, 'src/app.module.ts'));
	fs.removeSync(path.join(dest, 'src/server'));

	function extract(ngOptions, cliOptions, program, host) {
		return extractor_1.Extractor.create(ngOptions, program, host, cliOptions.locale).extract(cliOptions.i18nFormat, cliOptions.outFile);
	}

	console.log('run ng-xi18n');
	let cliOptions = new tsc.I18nExtractionCliOptions({project: dest});
	tsc.main(dest, cliOptions, extract)
		.then(function (exitCode) {
			fs.copySync(path.join(dest, 'src/i18n/messages.xlf'), source_message);
			removeDest();
			console.log(source_message, 'written');
			fs.readFile(source_message, (err, data) => {
				if (err) return cb(err);
				cb(null, data);
			});
		})
		.catch(function (e) {
			console.log('error');
			removeDest();
			cb(e);
		});
};

let getLangs = function (cb) {
	let langs = [];
	fs.readdir(source_messages_path, (err, files) => {
		if (err) return cb(err);
		files.forEach(file => {
			let base = path.basename(file).split('.');
			if (base.length === 3) {
				if (base[0] === 'messages' && base[2] == 'xlf') {
					langs.push(base[1]);
				}
			}
		});
		cb(null, langs);
	});
};

let packageLanguage = function (lang, content, cb) {
	let xmljson = XMLLite.xml2js(content.toString());
	let filename = path.join(source_messages_path, 'messages.' + lang + '.ts');
	console.log('packaging to file', filename);
	let nodes = xmljson.children[0].children[0].children[0].children;
	nodes = nodes.filter(node => {
		let target = null;
		node.children = node.children.filter(subnode => {
			if (subnode.tag === 'target') target = subnode;
			return subnode.tag !== 'note';
		});
		if (!target || !target.children) return false;
		return true;
	});
	xmljson.children[0].children[0].children[0].children = nodes;
	let ts = "export const TRANSLATION_" + lang.toUpperCase() + " = `" + XMLLite.js2xml(xmljson) + "`;";
	fs.writeFile(filename, ts, cb)
};

let updateLanguage = function (lang, currentNodes, cb) {
	let transNodes = copyArray(currentNodes);

	function getNodeIndexByTag(nodeList, tag) {
		for (let i = 0, iLen = nodeList.length; i < iLen; i++) {
			if (nodeList[i].tag === tag) {
				return i;
			}
		}
		return -1;
	}

	function getNodeIndexById(nodeList, id) {
		for (let i = 0, iLen = nodeList.length; i < iLen; i++) {
			if (nodeList[i].attributes.id === id) {
				return i;
			}
		}
		return -1;
	}

	let filename = path.join(source_messages_path, 'messages.' + lang + '.xlf');
	console.log('merging to file', filename);
	fs.readFile(filename, (err, content) => {
		if (err) return cb(err);
		let xmljson = XMLLite.xml2js(content.toString());
		let nodes = xmljson.children[0].children[0].children[0].children;
		nodes = nodes.map((node) => {
			let i = getNodeIndexById(transNodes, node.attributes.id);
			if (i === -1) {
				console.log('Removing language node', lang, ':', JSON.stringify(node));
				return null;
			}
			let transNode = transNodes[i];

			let i_transTarget = getNodeIndexByTag(transNode.children, 'target');
			let i_Target = getNodeIndexByTag(node.children, 'target');
			transNode.children[i_transTarget] = node.children[i_Target];

			transNodes.splice(i, 1);
			return transNode;
			return true;
		}).filter(node => {
			return node;
		});
		if (transNodes.length > 0) {
			console.log('Adding ', transNodes.length, ' Entries');
			nodes = nodes.concat(transNodes);
		}
		xmljson.children[0].children[0].children[0].children = nodes;
		let xml = XMLLite.beautify(XMLLite.js2xml(xmljson));
		fs.writeFile(filename, xml, function (err) {
			if (err) return cb(err);
			packageLanguage(lang, xml, cb);
		});
	});
};

let createLanguage = function (lang, cb) {
	let filename = path.join(source_messages_path, 'messages.' + lang + '.xlf');
	console.log("Creating translation file", filename);
	fs.copy(source_message, filename, cb);
};

let updateLanguages = function (content, cb) {
	let l = XMLLite.xml2js(content.toString());
	let currentNodes = l.children[0].children[0].children[0].children;
	getLangs(function (err, langs) {
		async.forEachSeries(langs, (lang, next) => {
			updateLanguage(lang, currentNodes, next)
		}, cb);
	})
};

runNGi18n((e, content) => {
	if (e) {
		console.error(e.stack);
		console.error('Something failed with ngi18n');
		process.exit(1);
		return;
	}
	updateLanguages(content, e => {
		if (e) {
			console.error(e.stack);
			console.error('Something failed with updating the languages');
			process.exit(1);
			return;
		}
		console.log('done');
		process.exit();
	});
});
