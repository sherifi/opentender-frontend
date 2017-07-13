import {NgModule} from '@angular/core';
import {App, AppConfig} from '../app/app.config';
import * as Config from 'config.browser.js';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {LeafletModule} from '@asymmetrik/angular2-leaflet';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
	bootstrap: [App],
	declarations: [
		...AppConfig.declarations
	],
	imports: [
		HttpModule,
		BrowserModule.withServerTransition({appId: 'opentender'}),
		BrowserAnimationsModule,
		LeafletModule.forRoot(),
		...AppConfig.imports
	],
	providers: [
		...AppConfig.providers,
		{provide: 'absurl', useValue: ''},
		{provide: 'COUNTRY', useValue: null},
		{provide: 'config', useValue: Config},
		{provide: 'isBrowser', useValue: true},
		{provide: 'globals', useValue: {window: window, document: document}}
	]
})
export class MainModule {
}
