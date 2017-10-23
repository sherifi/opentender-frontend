import {NgModule} from '@angular/core';
import {ChartCommonModule} from './common/chart/common-chart.module';
import {BarChartModule} from './bar-chart/bar-chart.module';
import {PieChartModule} from './pie-chart/pie-chart.module';
import {LineChartModule} from './line-chart/line-chart.module';
import {AreaChartModule} from './area-chart/area-chart.module';
import {HeatMapModule} from './heat-map/heat-map.module';
import {GaugeModule} from './gauge/gauge.module';
import {ForceDirectedGraphModule} from './force-directed-graph/force-directed-graph.module';
import {NumberCardModule} from './number-card/number-card.module';
import {TreeMapModule} from './tree-map/tree-map.module';
import 'd3-transition';

@NgModule({
	exports: [
		ChartCommonModule,
		BarChartModule,
		PieChartModule,
		LineChartModule,
		AreaChartModule,
		HeatMapModule,
		ForceDirectedGraphModule,
		NumberCardModule,
		TreeMapModule,
		GaugeModule,
	]
})
export class NgxChartsModule {
}
