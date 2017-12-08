import {NgModule} from '@angular/core';
import * as Config from 'client.config.js';
import {App, AppConfig} from '../app/app.config';

import {BrowserModule} from '@angular/platform-browser';
import {ServerModule} from '@angular/platform-server';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NoopLeafletModule} from './leaflet.mock.module';
// import {ServerPrebootModule} from 'preboot/server';

const MockWindow = {
	isMock: true
};

const config = {
	bootstrap: [App],
	declarations: [
		...AppConfig.declarations
	],
	imports: [
		NoopAnimationsModule,
		BrowserModule.withServerTransition({appId: 'opentender'}),
		ServerModule,
		// ServerPrebootModule.recordEvents({appRoot: 'app', buffer: false}),
		NoopLeafletModule.forRoot(),
		...AppConfig.imports
	],
	providers: [
		...AppConfig.providers,
		{provide: 'config', useValue: Config},
		{provide: 'isBrowser', useValue: false},
		{provide: 'globals', useValue: {window: MockWindow, document: {isMock: true}}}
	]
};

// Trick the Universal Obj Cache into different instances

@NgModule({
	bootstrap: config.bootstrap,
	declarations: config.declarations,
	imports: config.imports,
	providers: config.providers
})
export class MainModuleEN {
}

@NgModule({
	bootstrap: config.bootstrap,
	declarations: config.declarations,
	imports: config.imports,
	providers: config.providers
})
export class MainModuleDE {
}

@NgModule({
	bootstrap: config.bootstrap,
	declarations: config.declarations,
	imports: config.imports,
	providers: config.providers
})
export class MainModuleES {
}
