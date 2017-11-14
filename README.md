# Opentender Portal Site Frontend App

Rendering HTML on the Server and a HTML5 Web App in the Browser

written in Typescript and SCSS

## Installation

- install [NodeJS](https://nodejs.org/) 6.x and [NPM](https://www.npmjs.com/)

- run command `npm install` in the root folder of this repository

- prepare the data folder (see https://github.com/digiwhist/opentender-data)

- copy file 'config.dist.js' to 'config.js' and make the changes to reflect your infrastructure

```javascript
let settings = {
	server: {
		listen: {  // where the frontend should be listening
			host: '127.0.0.1',
			port: 3000
		},
		data: { // absolute paths to the data folders (see https://github.com/digiwhist/opentender-data)
			path: '/var/www/opentender/data/shared'
		},
		cache: {
        		type: 'disabled', // disabled | internal | memcached
        		memcached: ['127.0.0.1:11211'] // if type == memcached, server address(es)
		},
		backendUrl: 'http://127.0.0.1:3001', // full url of the backend for the server
		fullUrl: 'https://portal.opentender.eu' // full url of the frontend for the server app (e.g. for absolute OpenGraph Share Image URLs)
	},
	client: {
		version: '0.0.2', // version of app (is e.g. used for display in footer & "uncaching" resources on app update)
		backendUrl: 'https://portal.opentender.eu' // full url of the backend for the client app
	},
	webpack: {
		analyze: false, // analyze the webpack build (generates .html results in /dist folder)
		sourcemaps: false, // generate .map files for .js & .css
		minimize: true, // minimize & uglify the client code js
		debug: false // tell webpack be more verbose
	}
};
```

## Commands

### Serve

`npm run server` to build the app and start the server

### Build

`npm run build` to build the app into a static bundle

### Watch files

`npm run watch` to watch for file changes and restart the server if needed

### Development

run `npm run develop` and `npm run watch` in two separate terminals to build your client app, start a web server, and allow file changes to update in realtime

### Update typescript definitions after changes on schema.json

`npm run schema` to convert schema.json into /src/app/model/tender.d.ts

### Update Language files for Translation

`npm run langs` to extract all translation strings into the language files in /src/i18n/

## Uses

* [NodeJS](https://nodejs.org/)
* [NPM](https://www.npmjs.com/)
* [Angular 5](https://angular.io/) Universal
* [Webpack](https://webpack.github.io)
* [Typescript](https://www.typescriptlang.org/)

and more - please see package.json
