import {NgModule} from '@angular/core';

import {BrowserModule} from '@angular/platform-browser';
import {ServerModule} from '@angular/platform-server';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from '../app/app.component';
import {AppConfig} from '../app/app.config';

// import {ServerPrebootModule} from 'preboot/server';

const MockWindow = {
	isMock: true
};

@NgModule({
	bootstrap: [AppComponent],
	declarations: [
		...AppConfig.declarations
	],
	imports: [
		NoopAnimationsModule,
		BrowserModule.withServerTransition({appId: 'opentender'}),
		ServerModule,
		// ServerPrebootModule.recordEvents({appRoot: 'app', buffer: false}),
		...AppConfig.imports
	],
	providers: [
		...AppConfig.providers,
		{provide: 'isBrowser', useValue: false},
		{provide: 'globals', useValue: {window: MockWindow, document: {isMock: true}}}
	]
})
export class MainModule {
}
