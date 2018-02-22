import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import {BrowserPrebootModule} from 'preboot/browser';
import {Angulartics2, Angulartics2Module} from 'angulartics2';
import {Angulartics2Piwik} from './angulartics2-piwik.fix';
import {ConfigService} from '../app/services/config.service';
import {AppComponent} from '../app/app.component';
import {AppConfig} from '../app/app.config';
import {environment} from '../environments/environment';

@NgModule({
	bootstrap: [AppComponent],
	declarations: [
		...AppConfig.declarations,
	],
	imports: [
		...AppConfig.imports,
		HttpClientModule,
		BrowserModule.withServerTransition({appId: 'opentender'}),
		// BrowserPrebootModule.replayEvents(),
		BrowserAnimationsModule,
		Angulartics2Module.forRoot([Angulartics2Piwik], { developerMode: !environment.production }) // include after routes
	],
	providers: [
		...AppConfig.providers,
		{provide: 'absurl', useValue: null},
		{provide: 'config', useValue: null},
		{provide: 'opentender', useValue: null},
		{provide: 'isBrowser', useValue: true},
		{provide: 'globals', useValue: {window: window, document: document}},
		Angulartics2Piwik
	]
})
export class MainModule {
	// inject Angulartics2Piwik to initialize it!
	constructor(private angulartics2: Angulartics2, private angulartics2Piwik: Angulartics2Piwik) {
	}
}
