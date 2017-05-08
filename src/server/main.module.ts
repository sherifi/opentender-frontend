import {NgModule} from '@angular/core';
import * as Config from 'config.node.js';
import {App, AppModule} from '../app/app.module';

import { BrowserModule } from '@angular/platform-browser';
import { ServerModule } from '@angular/platform-server';

const MockWindow = {
	isMock: true
};

const config = {
	bootstrap: [App],
	declarations: [],
	imports: [
		BrowserModule.withServerTransition({appId: 'opentender'}),
		ServerModule,
		AppModule.forRoot()
	],
	providers: [
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
