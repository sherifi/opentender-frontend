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
const Ast = require("ts-simple-ast/dist/TsSimpleAst.js").TsSimpleAst;
const ts = require("typescript");
const indicators = require('../src/app/model/indicators.json');
const routes = require('../src/app/model/routes.json');

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
	fs.copySync(path.join(source, 'tsconfig.i18n.json'), path.join(dest, 'tsconfig.json'));
	fs.copySync(path.join(source, 'tslint.json'), path.join(dest, 'tslint.json'));
	fs.copySync(path.join(source, 'config.js'), path.join(dest, 'config.js'));
	fs.removeSync(path.join(dest, 'src/app.module.ts'));
	fs.removeSync(path.join(dest, 'src/server'));
	fillI18nTemplate(path.join(dest, 'src/app/modules/i18n/components'));
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
	let filename = path.join(source_messages_path, 'language.' + lang + '.xlf');
	console.log('packaging to file', filename);
	let nodes = xmljson.children[0].children[0].children[0].children;
	nodes = nodes.filter(node => {
		node.children = node.children.filter(subnode => (subnode.tag === 'target'));
		return node.children.length > 0;
	});
	xmljson.children[0].children[0].children[0].children = nodes;
	let s = XMLLite.js2xml(xmljson).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
	fs.writeFile(filename, s, cb);
};

let extractRunTimeStrings = (tsConfigFilePath, srcFilePath, opts) => {
	const ast = new Ast({tsConfigFilePath});
	ast.addExistingSourceFiles(path.join(srcFilePath, "**/*.ts"));
	const sourceFiles = ast.getSourceFiles();

	const list = [];
	const dejavu = [];

	const addText = (obj) => {
		if (list.indexOf(obj.text) < 0) {
			list.push(obj.text);
		}
	};

	const check = (obj) => {
		if (obj && obj.text && (obj.kind === 9) && obj.parent) {
			// is Routes title data?
			// if (obj.parent.name && (opts.RouteFields.indexOf(obj.parent.name.escapedText) >= 0) && isChildOf(obj, opts.Routes)) {
			// 	addText(obj);
			// } else
			// is Constant Lists?
			if (obj.parent.name && (opts.CollectionFields.indexOf(obj.parent.name.escapedText) >= 0) && isChildOf(obj, opts.Collections)) {
				addText(obj);
			} else
			// is i18n.get('...') call or this.get('...') on I18NService or i18n.getFormat('...', [...]) call or this.getFormat('...',[...]) on I18NService
			if (isI18NCall(obj)) {
				if (obj.parent.expression.name && (opts.I18NServiceCalls.indexOf(obj.parent.expression.name.escapedText) >= 0)) {
					addText(obj);
				} else if (obj.parent.expression.name && (opts.I18NServiceCalls.indexOf(obj.parent.expression.name.escapedText) >= 0)) {
					addText(obj);
				}
			}
		}
	};

	const isI18NCall = (obj) => {
		if (obj.parent && obj.parent.expression && obj.parent.expression.expression) {
			if (obj.parent.expression.expression.name && (opts.I18NServiceVariableNames.indexOf(obj.parent.expression.expression.name.escapedText) >= 0)) {
				return true;
			} else if (opts.I18NServiceVariableNames.indexOf(obj.parent.expression.expression.escapedText) >= 0) {
				return true;
			} else if (!obj.parent.expression.expression.name && isChildOf(obj, opts.I18NServiceNames)) {
				return true;
			}
		}
		return false;
	};

	const isChildOf = (obj, localSymbolNames) => {
		if (obj.name && localSymbolNames.indexOf(obj.name.escapedText) >= 0) {
			return true;
		}
		if (obj.parent) return isChildOf(obj.parent, localSymbolNames);
		return false;
	};

	const scanNode = (node) => {
		if (dejavu.indexOf(node) >= 0) {
			return;
		}
		dejavu.push(node);
		check(node);
		Object.keys(node).forEach(key => {
			if ((node[key] === undefined) ||
				(node[key] === null) ||
				(['parent', 'nextContainer'].indexOf(key) >= 0) ||
				(['number', 'string', 'boolean'].indexOf(typeof node[key]) >= 0)) {
				return;
			}
			if (Array.isArray(node[key])) {
				node[key].forEach((n) => {
					scanNode(n);
				})
			} else if (typeof node[key] === 'object') {
				let o = node[key].constructor.name;
				if (o === 'Map') {
				} else {
					scanNode(node[key]);
				}
			} else {
				console.log('ignored', typeof node[key]);
			}
		})
	};
	sourceFiles.forEach(sourceFile => {
		if (sourceFile.compilerNode.fileName.indexOf(srcFilePath) >= 0) {
			scanNode(sourceFile.compilerNode);
		}
	});
	return list;
};

let fillI18nTemplate = function (folder) {
	console.log('extracting runtime strings with typescript');
	let opts = {
		Collections: ['TenderColumns', 'AuthorityColumns', 'CompanyColumns', 'TenderFilterDefs', 'CompanyFilterDefs', 'AuthorityFilterDefs'],
		CollectionFields: ['name', 'group'],
		// Routes: ['routes'],
		// RouteFields: ['title', 'menu_title'],
		I18NServiceNames: ['I18NService'],
		I18NServiceVariableNames: ['i18n'],
		I18NServiceCalls: ['get', 'getFormat']
	};
	const runtimestrings = extractRunTimeStrings(path.join(dest, 'tsconfig.json'), path.join(dest, 'src'), opts);

	const scanRoute = (route) => {
		if (route.title && runtimestrings.indexOf(route.title) < 0) {
			runtimestrings.push(route.title)
		}
		if (route.menu_title && runtimestrings.indexOf(route.menu_title) < 0) {
			runtimestrings.push(route.menu_title)
		}
		if (route.children) {
			route.children.forEach(route => scanRoute(route));
		}
	};

	routes.routes.forEach(route => scanRoute(route));

	runtimestrings.sort((a, b) => {
		if (a < b) return -1;
		if (a > b) return 1;
		return 0;
	});
	console.log('filling template, runtime strings:', runtimestrings.length, path.join(folder, 'i18n.template.html'));

	let used = {};
	let vars = [];
	let list = runtimestrings.map(s => {
		let id = s.replace(/ /g, '');
		if (used[id]) {
			console.log('Warning: duplicate runtime string id:', id, 'text:', s);
		}
		used[id] = s;
		let vs = s.match(/{{.*?}}/g);
		if (vs && vs.length > 0) {
			vs.forEach(v => {
				v = v.replace(/[{}]/g, '');
				if (vars.indexOf(v) < 0) {
					vars.push(v);
				}
			});
		}
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
	fs.writeFileSync(path.join(folder, 'i18n.template.html'), list.join('\n'));

	let mod = `import {Component} from '@angular/core';
	@Component({
		selector: 'tmpI18NComponent',
		moduleId: __filename,
		templateUrl: 'i18n.template.html'})
	export class I18NComponent {` +
		vars.map(v => {
			return v + ':string'
		}).join(';') + '}';
	fs.writeFileSync(path.join(folder, 'i18n.component.ts'), mod);
};

let matchAll = function (regex, text) {
	let result = [];
	while ((match = regex.exec(text)) != null) {
		// console.log(match);
		result.push({index: match.index, match: match[0]});
	}
	return result;
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
				let source = node.children.find(sub => sub.tag === 'source');
				let i_Target = getNodeIndexByTag(node.children, 'target');
				if (i_Target >= 0) {
					let newNode = node.children[i_Target];
					if (source.children && source.children.length > 1) {
						let interpolations = source.children.filter(sub => sub.tag === 'x');
						let parts = newNode.children[0].text.split('&lt;x').filter(part => part.indexOf('id="') >= 0).map(part => part.slice(0, part.indexOf('/&gt;')));
						if (interpolations.length !== parts.length) {
							console.error('---- Invalid Interpolation Count, ERROR in ' + lang + ' id: ' + transNode.attributes.id);
							console.error('expected', interpolations.length, interpolations);
							console.error('was', parts.length, newNode.children);
						} else {
							interpolations.forEach((interpolation, index) => {
								if (parts[index].indexOf('id="' + interpolation.attributes.id + '"') < 0) {
									console.error('---- Invalid Interpolation Order, ERROR in ' + lang + ' id: ' + transNode.attributes.id);
									console.error('expected', interpolation);
									console.error('was', parts[index]);
									console.error('context', JSON.stringify(transNode));
								}
							})
						}
					}
					if (newNode.children && newNode.children[0] && newNode.children[0].text) {
						let text = newNode.children[0].text;

						let reg = /&lt;x ctype="x-a" equiv-text="&amp;lt;\/a&amp;gt;" id="CLOSE_LINK"\/&gt;/g;
						let matches = matchAll(reg, text);
						matches.forEach(match => {
							let c = text[match.index - 1];
							if (c === ' ') {
								console.error('---- Space before link end in ' + lang + ' id: ' + transNode.attributes.id);
								console.error(match);
								console.error(text);
							}
							c = text[match.index + match.match.length];
							if ([undefined, '.', ',', '-', ')', ' '].indexOf(c) < 0) {
								console.error('---- NO Space after end link in ' + lang + ' id: ' + transNode.attributes.id);
								console.error('"' + c + '"');
								console.error(match);
								console.error(text);
							}
						});

						reg = /&lt;x ctype="x-a" equiv-text="&amp;lt;a&amp;gt;" id="START_LINK?[0-9]?"\/&gt;/g;
						matchAll(reg, text).forEach(match => {
							let c = text[match.index - 1];
							if ([undefined, ' ', ';', "(", '['].indexOf(c) < 0) {
								console.error('---- NO Space before start link in ' + lang + ' id: ' + transNode.attributes.id);
								console.error('"' + c + '"');
								console.error(match);
								console.error(text);
							}
							c = text[match.index + match.match.length];
							if (c === ' ') {
								console.error('---- Space after start link in ' + lang + ' id: ' + transNode.attributes.id);
								console.error(match);
								console.error(text);
							}
						});

						reg = /&lt;x equiv-text=".*?" id="INTERPOLATION_?[0-9]?"\/&gt;/g;
						matchAll(reg, text).forEach(match => {
							let c = text[match.index - 1];
							if ([undefined, ' ', ';', '/', '(', '['].indexOf(c) < 0) {
								console.error('---- NO Space before interpolation in ' + lang + ' id: ' + transNode.attributes.id);
								console.error('"' + c + '"');
								console.error(text);
							}
							c = text[match.index + match.match.length];
							if ([undefined, ' ', '&', ']', '/', '!', '?', '-', '.'].indexOf(c) < 0) {
								console.error('---- NO Space after interpolation in ' + lang + ' id: ' + transNode.attributes.id);
								console.error('"' + c + '"');
								console.error(match);
								console.error(text);
							}
						});


					}
					transNode.children.push(newNode);
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

let updateLanguages = function (content, cb) {
	let l = XMLLite.xml2js(content.toString());
	let currentNodes = l.children[0].children[0].children[0].children;
	getLangs(function (err, langs) {
		async.forEachSeries(langs, (lang, next) => {
			updateLanguage(lang, currentNodes, next)
		}, cb);
	})
};

let languages = JSON.parse(fs.readFileSync(path.join(source_messages_path, 'languages.json')).toString()).enabled;

languages.forEach(lang => {
	if (lang.id === 'en') {
		return;
	}
	let filename = path.join(source_messages_path, 'messages.' + lang.id + '.xlf');
	if (!fs.existsSync(filename)) {
		console.log("Creating translation file", filename);
		let s = '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2"><file datatype="plaintext" original="ng2.template" source-language="en" target-language="' + lang.id + '"><body></body></file></xliff>';
		fs.writeFileSync(filename, s);
	}
});

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
