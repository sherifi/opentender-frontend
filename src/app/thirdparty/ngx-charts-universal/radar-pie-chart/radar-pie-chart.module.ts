import {NgModule} from '@angular/core';
import {ChartCommonModule} from '../common/chart/common-chart.module';
import {CommonLegendModule} from '../common/legend/common-legend.module';
import {CommonTooltipModule} from '../common/tooltip/common-tooltip.module';
import {RadarPieChartComponent} from './radar-pie-chart.component';
import {CommonRadarPieModule} from '../common/radar-pie/common-radar-pie.module';

export {RadarPieChartComponent};

const COMPONENTS = [RadarPieChartComponent];

@NgModule({
	imports: [ChartCommonModule, CommonLegendModule, CommonRadarPieModule, CommonTooltipModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class RadarPieChartModule {
}
