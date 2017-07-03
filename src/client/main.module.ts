import {NgModule} from '@angular/core';
import {App, AppModule} from '../app/app.module';
import * as Config from 'config.browser.js';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
	bootstrap: [App],
	declarations: [],
	imports: [
		HttpModule,
		BrowserModule.withServerTransition({appId: 'opentender'}),
		AppModule.forRoot(),
		// BrowserAnimationsModule,
	],
	providers: [
		{provide: 'absurl', useValue: ''},
		{provide: 'COUNTRY', useValue: null},
		{provide: 'config', useValue: Config},
		{provide: 'isBrowser', useValue: true},
		{provide: 'globals', useValue: {window: window, document: document}}
	]
})
export class MainModule {
}
