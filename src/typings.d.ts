// Extra variables that live on Global that will be replaced by webpack DefinePlugin
declare var __dirname: string;
declare var __filename: string;
declare var ENV: string;
declare var HMR: boolean;

interface GlobalEnvironment {
	ENV;
	HMR;
}

interface Window {}

interface WebpackModule {
	hot: {
		data?: any,
		idle: any,
		accept(dependencies?: string | string[], callback?: (updatedDependencies?: any) => void): void;
		decline(dependencies?: string | string[]): void;
		dispose(callback?: (data?: any) => void): void;
		addDisposeHandler(callback?: (data?: any) => void): void;
		removeDisposeHandler(callback?: (data?: any) => void): void;
		check(autoApply?: any, callback?: (err?: Error, outdatedModules?: any[]) => void): void;
		apply(options?: any, callback?: (err?: Error, outdatedModules?: any[]) => void): void;
		status(callback?: (status?: string) => void): void | string;
		removeStatusHandler(callback?: (status?: string) => void): void;
	};
}

interface WebpackRequire {
	context(file: string, flag?: boolean, exp?: RegExp): any;
}

interface ErrorStackTraceLimit {
	stackTraceLimit: number;
	// stackTraceLimit(limit: number): void;
}


// Extend typings
interface NodeRequire extends WebpackRequire {
}

interface ErrorConstructor extends ErrorStackTraceLimit {
}

interface NodeModule extends WebpackModule {
}

interface Global extends GlobalEnvironment {
}


interface Thenable<T> {
	then<U>(onFulfilled?: (value: T) => U | Thenable<U>,
			onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
	then<U>(onFulfilled?: (value: T) => U | Thenable<U>,
			onRejected?: (error: any) => void): Thenable<U>;
	catch<U>(onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
}

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

declare module 'config.node.js' {
	export var client: ClientConfig;
}

declare module 'geoip-ultralight' {
	export var lookupCountry: (ip: string) => string;
}
