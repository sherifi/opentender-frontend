declare var __dirname: string;
declare var __filename: string;

interface ServerConfig {
	listen: {
		host: string,
		port: number
	};
	disableCache: boolean;
	data: {
		path: string;
		shared: string;
	};
	backendUrl: string;
}

interface ClientConfig {
	version: string;
	backendUrl: string;
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
