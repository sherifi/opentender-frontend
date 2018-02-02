import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageScrollDirective} from './page-scroll.directive';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		PageScrollDirective
	],
	exports: [
		PageScrollDirective
	],
	providers: [
	]
})
export class PageScrollModule {
}
