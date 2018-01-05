import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommonTooltipModule} from '../../../thirdparty/ngx-charts-universal/common/tooltip/common-tooltip.module';
import {HeatMapGridModule} from '../../../thirdparty/ngx-charts-universal/heat-map-grid/heat-map-grid.module';
import {GraphScoreGradientComponent} from './score-gradient.component';

@NgModule({
	imports: [
		CommonModule,
		HeatMapGridModule,
		CommonTooltipModule
	],
	declarations: [
		GraphScoreGradientComponent
	],
	exports: [
		GraphScoreGradientComponent
	]
})
export class GraphsGradientModule {
}
