import {NgModule} from '@angular/core';
import {SvgLinearGradientComponent} from './svg-linear-gradient.component';
import {SvgRadialGradientComponent} from './svg-radial-gradient.component';
import {CommonModule} from '@angular/common';

const COMPONENTS = [SvgLinearGradientComponent, SvgRadialGradientComponent];

@NgModule({
	imports: [CommonModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class CommonGradientModule {
}
