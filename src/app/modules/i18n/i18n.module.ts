import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {I18NService} from './services/i18n.service';
import {I18nPipe} from './pipes/i18n.pipe';
import {I18NComponent} from './components/i18n.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		I18nPipe,
		I18NComponent
	],
	exports: [
		I18nPipe,
		I18NComponent
	],
	providers: [
		I18NService
	]
})
export class I18nModule {
}
