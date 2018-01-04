import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {I18NService} from './services/i18n.service';
import {I18nPipe} from './pipes/i18n.pipe';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		I18nPipe
	],
	exports: [
		I18nPipe
	],
	providers: [
		I18NService
	]
})
export class I18nModule {
}
