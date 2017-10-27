import {NgModule} from '@angular/core';
import {App, AppConfig} from '../app/app.config';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserPrebootModule} from 'preboot/browser';
import {Angulartics2, Angulartics2Module} from 'angulartics2';
import {Angulartics2Piwik} from './angulartics2-piwik.fix';
import {ConfigService} from '../app/services/config.service';

@NgModule({
	bootstrap: [App],
	declarations: [
		...AppConfig.declarations
	],
	imports: [
		HttpClientModule,
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
	// inject Angulartics2Piwik to initialize it!!!
	constructor(private angulartics2: Angulartics2, private angulartics2Piwik: Angulartics2Piwik, private config: ConfigService) {
		angulartics2.developerMode(config.config.devMode);
	}
}
