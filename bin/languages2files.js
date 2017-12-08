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
const fs = require('fs-extra');
const async = require('async');
const path = require('path');
const clone = require('clone');
const XMLLite = require('xml-lite');
const runtimestrings = require('./runtime-strings.json');
const indicators = require('../src/app/model/indicators.json');

/*************************************
 * Constants
 *************************************/
const source = path.join(__dirname, '..');
const dest = path.join(__dirname, '..', 'dist', 'temp');
const source_messages_path = path.join(source, 'src', 'i18n');
const source_message = path.join(source, 'src', 'i18n', 'messages.xlf');

function copyArray(source) {
	return source.map(node => clone(node));
}

let removeDest = function () {
	if (dest.length > 3) {
		console.log('removing dest', dest);
		fs.removeSync(dest);
	}
};

let prepareProject = function () {
	console.log('copy project files to', dest);
	fs.copySync(path.join(source, 'node_modules/@types'), path.join(dest, 'node_modules/@types'));
	fs.copySync(path.join(source, 'src'), path.join(dest, 'src'));
	fs.copySync(path.join(source, 'tsconfig.json'), path.join(dest, 'tsconfig.json'));
	fs.copySync(path.join(source, 'tslint.json'), path.join(dest, 'tslint.json'));
	fs.copySync(path.join(source, 'config.js'), path.join(dest, 'config.js'));
	// fs.copySync(path.join(source, 'webpack.config.js'), path.join(dest, 'webpack.config.js'));
	fs.removeSync(path.join(dest, 'src/app.module.ts'));
	fs.removeSync(path.join(dest, 'src/server'));
	fillI18nTemplate(path.join(dest, 'src/app/components/i18n.template.html'));
};

let __assign = (this && this.__assign) || Object.assign || function (t) {
	for (let s, i = 1, n = arguments.length; i < n; i++) {
		s = arguments[i];
		for (let p in s) if (Object.prototype.hasOwnProperty.call(s, p))
			t[p] = s[p];
	}
	return t;
};

let runNGi18n = function (cb) {
	removeDest();
	prepareProject();
	console.log('run ng-xi18n');
	process.chdir(dest);
	let api = require("@angular/compiler-cli/src/transformers/api");
	let main_1 = require("@angular/compiler-cli/src/main");
	let args = [];
	let options = {};
	let config = main_1.readCommandLineAndConfiguration(args, options, ['outFile', 'i18nFormat', 'locale']);
	let cmd = __assign({}, config, {emitFlags: api.EmitFlags.I18nBundle});
	main_1.main(args, console.error, cmd);
	console.log('processing ng-xi18n result');
	if (!fs.existsSync(path.join(dest, 'messages.xlf'))) {
		return cb('Error: result messages.xlf does not exists, can not continue');
	}
	fs.readFile(path.join(dest, 'messages.xlf'), (err, data) => {
		let l = XMLLite.xml2js(data.toString());
		let currentNodes = l.children[0].children[0].children[0].children;
		if (!currentNodes) {
			console.log('language file is empty? aborting...');
			return;
		}
		fs.copySync(path.join(dest, 'messages.xlf'), source_message);
		removeDest();
		console.log(source_message, 'written');
		if (err) return cb(err);
		cb(null, data);
	});
};

let getLangs = function (cb) {
	let langs = [];
	fs.readdir(source_messages_path, (err, files) => {
		if (err) return cb(err);
		files.forEach(file => {
			let base = path.basename(file).split('.');
			if (base.length === 3) {
				if (base[0] === 'messages' && base[2] === 'xlf') {
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
		node.children = node.children.filter(subnode => (subnode.tag === 'target'));
		return node.children.length > 0;
	});
	xmljson.children[0].children[0].children[0].children = nodes;
	let s = XMLLite.js2xml(xmljson).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
	let ts = "/* tslint:disable:max-line-length */\nexport const TRANSLATION_" + lang.toUpperCase() + " = `" + s + "`;\n";
	fs.writeFile(filename, ts, cb)
};

let fillI18nTemplate = function (filename) {
	let used = {};
	let list = runtimestrings.map(s => {
		let id = s.replace(/ /g, '');
		if (used[id]) {
			console.log('Warning: duplicate runtime string id:', id, 'text:', s);
		}
		used[id] = s;
		return '<span i18n="runtime@@' + id + '">' + s + '</span>';
	});
	Object.keys(indicators).forEach(ikey => {
		let indicator = indicators[ikey];
		list.push('<span i18n="runtime@@' + ikey + '.name">' + indicator.name + '</span>');
		list.push('<span i18n="runtime@@' + ikey + '.plural">' + indicator.plural + '</span>');
		Object.keys(indicator.subindicators).forEach(skey => {
			let sub = indicator.subindicators[skey];
			list.push('<span i18n="runtime@@' + skey + '.name">' + sub.name + '</span>');
			list.push('<span i18n="runtime@@' + skey + '.desc">' + sub.desc + '</span>');
		});
	});
	fs.writeFileSync(filename, list.join('\n'));
};

let updateLanguage = function (lang, currentNodes, cb) {
	let transNodes = copyArray(currentNodes);

	function getNodeIndexByTag(nodeList, tag) {
		if (!nodeList) return -1;
		for (let i = 0, iLen = nodeList.length; i < iLen; i++) {
			if (nodeList[i].tag === tag) {
				return i;
			}
		}
		return -1;
	}

	function getNodeIndexById(nodeList, id) {
		if (!nodeList) return -1;
		for (let i = 0, iLen = nodeList.length; i < iLen; i++) {
			if (nodeList[i].attributes.id === id) {
				return i;
			}
		}
		return -1;
	}

	let filename = path.join(source_messages_path, 'messages.' + lang + '.xlf');
	console.log('merging to', lang, 'file', filename);
	fs.readFile(filename, (err, content) => {
		if (err) return cb(err);
		let xmljson = XMLLite.xml2js(content.toString());
		let nodes = xmljson.children[0].children[0].children[0].children;
		transNodes.forEach((transNode) => {
			let i = getNodeIndexById(nodes, transNode.attributes.id);
			if (i >= 0) {
				let node = nodes[i];
				let i_Target = getNodeIndexByTag(node.children, 'target');
				if (i_Target >= 0) {
					transNode.children.push(node.children[i_Target]);
				}
			}
		});
		xmljson.children[0].children[0].children[0].children = transNodes;
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
