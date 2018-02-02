import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GraphFooterModule} from '../../graph-footer/graph-footer.module';
import {CommonTooltipModule} from '../../../thirdparty/ngx-charts-universal/common/tooltip/common-tooltip.module';
import {GraphIndicatorStructureComponent} from './indicator-structure.component';
import {RadarPieChartModule} from '../../../thirdparty/ngx-charts-universal/radar-pie-chart/radar-pie-chart.module';

@NgModule({
	imports: [
		CommonModule,
		GraphFooterModule,
		RadarPieChartModule,
		CommonTooltipModule
	],
	declarations: [
		GraphIndicatorStructureComponent
	],
	exports: [
		GraphIndicatorStructureComponent
	]
})
export class GraphsRadarPieModule {
}
