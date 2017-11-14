declare var __dirname: string;
declare var __filename: string;

interface ServerConfig {
	listen: {
		host: string,
		port: number
	};
	data: {
		path: string;
		shared: string;
	};
	cache: {
		type: string; // disabled | internal | memcached
		memcached: Array<string>; // if type == memcached, server address(es)
	};
	backendUrl: string;
	fullUrl: string;
}

interface ClientConfig {
	version: string;
	backendUrl: string;
	devMode: boolean;
}

declare module '*.json' {
	const value: any;
	export default value;
}

declare module 'config.js' {
	export var server: ServerConfig;
	export var client: ClientConfig;
}

declare module 'client.config.js' {
	export var version: string;
	export var backendUrl: string;
	// export var client: ClientConfig;
}

declare module 'geoip-ultralight' {
	export var lookupCountry: (ip: string) => string;
}
