let settings = {
	server: {
		listen: {  // where the frontend should be listening
			host: '127.0.0.1',
			port: 3000
		},
		data: { // absolute paths to the data folders (see https://github.com/digiwhist/opentender-data)
			path: '/var/www/opentender/data/shared'
		},
		backendUrl: 'http://127.0.0.1:3001',
		fullUrl: 'https://portal.opentender.eu',
		cache: {
			type: 'disabled', // disabled | internal | memcached
			memcached: ['127.0.0.1:11211'] // if type == memcached, server address(es)
		}
	},
	client: {
		backendUrl: 'https://portal.opentender.eu', // full url of the backend
		devMode: false // e.g. disable page tracking if true
	},
	webpack: {
		analyze: false, // analyze the webpack build (generates .html results in /dist folder)
		sourcemaps: false, // generate .map files for .js & .css
		minimize: true, // minimize & uglify the client code js
		debug: false // tell webpack be more verbose
	}
};
module.exports = settings;
