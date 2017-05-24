import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SliderHandleDirective} from './slider-handle.directive';
import {SliderComponent} from './slider.component';

@NgModule({
	imports: [CommonModule, FormsModule],
	declarations: [SliderComponent, SliderHandleDirective],
	exports: [SliderComponent]
})
export class SliderModule {
}
