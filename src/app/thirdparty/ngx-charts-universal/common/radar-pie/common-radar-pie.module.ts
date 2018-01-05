import {NgModule} from '@angular/core';
import {CommonGradientModule} from '../gradient/common-gradient.module';
import {CommonModule} from '@angular/common';
import {CommonTooltipModule} from '../tooltip/common-tooltip.module';
import {CommonLegendModule} from '../legend/common-legend.module';
import {RadarPieSeriesComponent} from './radar-pie-series.component';
import {CommonPieModule} from '../pie/common-pie.module';

const COMPONENTS = [RadarPieSeriesComponent];

@NgModule({
	imports: [CommonModule, CommonGradientModule, CommonPieModule, CommonTooltipModule, CommonLegendModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class CommonRadarPieModule {
}
