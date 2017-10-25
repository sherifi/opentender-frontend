import {NgModule} from '@angular/core';
import {App, AppConfig} from '../app/app.config';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserPrebootModule} from 'preboot/browser';
import {Angulartics2Module, Angulartics2Piwik} from 'angulartics2';

@NgModule({
	bootstrap: [App],
	declarations: [
		...AppConfig.declarations
	],
	imports: [
		HttpModule,
		BrowserModule.withServerTransition({appId: 'opentender'}),
		BrowserPrebootModule.replayEvents(),
		BrowserAnimationsModule,
		LeafletModule.forRoot(),
		...AppConfig.imports,
		Angulartics2Module.forRoot([Angulartics2Piwik]) // include after routes
	],
	providers: [
		...AppConfig.providers,
		{provide: 'absurl', useValue: null},
		{provide: 'opentender', useValue: null},
		{provide: 'isBrowser', useValue: true},
		{provide: 'globals', useValue: {window: window, document: document}},
		Angulartics2Piwik
	]
})
export class MainModule {
}
