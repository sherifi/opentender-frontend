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

declare module '*languages.json' {
	const value: any;
	export default value;
}

declare module '*indicators.json' {
	const value: any;
	export default value;
}

declare module '*countries.json' {
	const value: any;
	export default value;
}

declare module '*partner.json' {
	export var partner: Array<IPartnerInfo>;
}

interface IPartnerInfo {
	name: string;
	url: string;
	img: string;
	contact: string;
	country: string;
}

interface IRouterInfo {
	path: string;
	title?: string;
	menu_title?: string;
	menu?: boolean;
	rootMenu?: boolean;
	rootHTML5?: boolean;
	routerLink?: Array<string>;
	children?: Array<IRouterInfo>;
}

declare module '*routes.json' {
	export var routes: Array<IRouterInfo>;
}

declare module '*config.js' {
	export var server: ServerConfig;
	export var client: ClientConfig;
}

declare module '*package.json' {
	export var version: string;
}

declare module 'geoip-ultralight' {
	export var lookupCountry: (ip: string) => string;
}
