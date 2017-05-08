import {NgModule} from '@angular/core';
import {CircleComponent} from './circle.component';
import {CircleSeriesComponent} from './circle-series.component';
import {CommonModule} from '@angular/common';
import {CommonGradientModule} from '../gradient/common-gradient.module';
import {CommonTooltipModule} from '../tooltip/common-tooltip.module';

const COMPONENTS = [CircleComponent, CircleSeriesComponent];

@NgModule({
	imports: [CommonModule, CommonGradientModule, CommonTooltipModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class CommonCircleModule {
}
