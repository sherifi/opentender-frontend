import {NgModule} from '@angular/core';
import {ChartCommonModule} from '../common/chart/common-chart.module';
import {HeatMapGridComponent} from './heat-map-grid.component';
import {CommonHeatmapModule} from '../common/heatmap/common-heatmap.module';
import {CommonAxisModule} from '../common/axis/common-axis.module';
import {CommonHeatmapCircleModule} from '../common/heatmap-circles/common-heatmap-circles.module';

export {HeatMapGridComponent};

const COMPONENTS = [HeatMapGridComponent];

@NgModule({
	imports: [ChartCommonModule, CommonHeatmapCircleModule, CommonAxisModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class HeatMapGridModule {
}
