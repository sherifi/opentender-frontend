let settings = {
	server: {
		listen: {  // where the frontend should be listening
			host: '127.0.0.1',
			port: 3000
		},
		data: { // absolute paths to the data folders (see https://github.com/digiwhist/opentender-data)
			path: '/var/www/opentender/data/shared'
		},
		disableCache: false, // html is cached, disable here for debugging purposes
		backendUrl: 'http://127.0.0.1:3001'
	},
	client: {
		version: '0.0.2', // version of app (is e.g. used for display in footer & "uncaching" resources on app update)
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
