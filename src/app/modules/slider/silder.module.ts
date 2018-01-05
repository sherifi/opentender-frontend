import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SliderHandleDirective} from './slider-handle.directive';
import {SliderComponent} from './slider.component';
import {SliderRibbonDirective} from './slider-ribbon.directive';

@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [
		SliderComponent,
		SliderHandleDirective,
		SliderRibbonDirective
	],
	exports: [
		SliderComponent
	]
})
export class SliderModule {
}
