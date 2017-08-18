import {NgModule} from '@angular/core';
import {BarSeriesVerticalComponent} from './bar-series-vertical.component';
import {BarSeriesHorizontalComponent} from './bar-series-horizontal.component';
import {BarComponent} from './bar.component';
import {CommonGradientModule} from '../gradient/common-gradient.module';
import {CommonModule} from '@angular/common';
import {CommonTooltipModule} from '../tooltip/common-tooltip.module';
import {BarSeriesHorizontalLabeledComponent} from './bar-series-horizontal-labeled.component';
import {CommonAxisModule} from '../axis/common-axis.module';

const COMPONENTS = [BarComponent, BarSeriesHorizontalComponent, BarSeriesVerticalComponent, BarSeriesHorizontalLabeledComponent];

@NgModule({
	imports: [CommonModule, CommonGradientModule, CommonTooltipModule, CommonAxisModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class CommonBarModule {
}
