#!/usr/bin/env node

/*

 Compiles the Typescript Interface File for a JSON Schema Definition File

 */

const dtsgen = require('dtsgenerator/src/index');
const path = require('path');
const fs = require('fs');
const config = require('../config.js');
const schema = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', config.server.data.path) + '/schema.json'));

const schemas = [{definitions: schema.definitions, id: 'opentender', $schema: schema.$schema}];
const prefix = null;
dtsgen.default(schemas, prefix).then((result) => {
	let sl = result.split('\n');
	sl.shift();
	sl.shift();
	sl.shift();
	sl.unshift('declare namespace Definitions {');
	sl.pop();
	sl.pop();
	sl.pop();
	sl.push('}');
	sl.push('');
	sl.unshift('/* tslint:disable:max-line-length */');
	fs.writeFileSync('../src/app/model/tender.d.ts', sl.join('\n')
			.replace(/string;\s*\| number/, 'string | number') //fix format bug "string; | number" => "string | number"
			// .replace(/_id: string;/g, 'id: string;')
			.replace(/        /g, '    ')
			.replace(/    /g, '\t')
			.replace(/"/g, "'")
		, {encoding: 'utf-8'});
	// console.log(result);
	console.log('written.');
}).catch((e) => {
	console.error(e.stack || e);
});

