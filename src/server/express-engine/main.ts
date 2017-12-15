import * as fs from 'fs';
import {Request, Response} from 'express';

import {NgModuleFactory, Type, CompilerFactory, Compiler, StaticProvider} from '@angular/core';
import {ResourceLoader} from '@angular/compiler';
import {INITIAL_CONFIG, renderModuleFactory, platformDynamicServer} from '@angular/platform-server';

import {FileLoader} from './file-loader';
import {REQUEST, RESPONSE} from './tokens';

/**
 * These are the allowed options for the engine
 */
export interface NgSetupOptions {
	id?: string;
	bootstrap?: Type<{}> | NgModuleFactory<{}>;
	providers?: StaticProvider[];
	languageProviders?: StaticProvider[];
	prepareHTML?: (html) => string;
}

/**
 * These are the allowed options for the render
 */
export interface RenderOptions extends NgSetupOptions {
	req: Request;
	res?: Response;
}

/**
 * This holds a cached version of each index used.
 */
const templateCache: { [key: string]: string } = {};

/**
 * Map of Module Factories
 */
const factoryCacheMaps: { [key: string]: Map<Type<{}>, NgModuleFactory<{}>> } = {};

/**
 * This is an express engine for handling Angular Applications
 */
export function ngExpressEngine(setupOptions: NgSetupOptions) {
	setupOptions.providers = setupOptions.providers || [];

	const compilerFactory: CompilerFactory = platformDynamicServer().injector.get(CompilerFactory);
	const compiler: Compiler = compilerFactory.createCompiler([
		{
			providers: [
				...(setupOptions.languageProviders || []),
				{provide: ResourceLoader, useClass: FileLoader, deps: []}
			]
		}
	]);

	return function(filePath: string, options: RenderOptions, callback: (err?: Error | null, html?: string) => void) {

		options.providers = options.providers || [];

		try {
			const moduleOrFactory = options.bootstrap || setupOptions.bootstrap;

			if (!moduleOrFactory) {
				throw new Error('You must pass in a NgModule or NgModuleFactory to be bootstrapped');
			}

			setupOptions.providers = setupOptions.providers || [];

			const extraProviders = setupOptions.providers.concat(
				options.providers,
				...(setupOptions.languageProviders || []),
				getReqResProviders(options.req, options.res),
				[
					{
						provide: INITIAL_CONFIG,
						useValue: {
							document: setupOptions.prepareHTML ? setupOptions.prepareHTML(getDocument(filePath)) : getDocument(filePath),
							url: options.req.originalUrl
						}
					}
				]);

			getFactory(setupOptions.id, moduleOrFactory, compiler)
				.then(factory => {
					return renderModuleFactory(factory, {
						extraProviders: extraProviders
					});
				})
				.then((html: string) => {
					callback(null, html);
				}, (err) => {
					callback(err);
				});
		} catch (err) {
			callback(err);
		}
	};
}


function getFactoryCache(id: string) {
	if (!factoryCacheMaps[id]) {
		factoryCacheMaps[id] = new Map<Type<{}>, NgModuleFactory<{}>>();
	}
	return factoryCacheMaps[id];
}

/**
 * Get a factory from a bootstrapped module/ module factory
 */
function getFactory(id: string, moduleOrFactory: Type<{}> | NgModuleFactory<{}>, compiler: Compiler): Promise<NgModuleFactory<{}>> {
	return new Promise<NgModuleFactory<{}>>((resolve, reject) => {
		// If module has been compiled AoT
		if (moduleOrFactory instanceof NgModuleFactory) {
			resolve(moduleOrFactory);
			return;
		} else {
			let moduleFactory = getFactoryCache(id).get(moduleOrFactory);

			// If module factory is cached
			if (moduleFactory) {
				resolve(moduleFactory);
				return;
			}

			// Compile the module and cache it
			compiler.compileModuleAsync(moduleOrFactory)
				.then((factory) => {
					getFactoryCache(id).set(moduleOrFactory, factory);
					resolve(factory);
				}, (err => {
					reject(err);
				}));
		}
	});
}

/**
 * Get providers of the request and response
 */
function getReqResProviders(req: Request, res?: Response): StaticProvider[] {
	const providers: StaticProvider[] = [
		{
			provide: REQUEST,
			useValue: req
		}
	];
	if (res) {
		providers.push({
			provide: RESPONSE,
			useValue: res
		});
	}
	return providers;
}

/**
 * Get the document at the file path
 */
function getDocument(filePath: string): string {
	return templateCache[filePath] = templateCache[filePath] || fs.readFileSync(filePath).toString();
}
