import {NgModule} from '@angular/core';
import * as Config from 'config.node.js';
import {App, AppConfig} from '../app/app.config';

import {BrowserModule} from '@angular/platform-browser';
import {ServerModule} from '@angular/platform-server';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NoopLeafletModule} from './leaflet.mock.module';

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

@NgModule(config)
export class MainModuleEN {
}

@NgModule(config)
export class MainModuleDE {
}

@NgModule(config)
export class MainModuleES {
}
