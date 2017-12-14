import {NgModule} from '@angular/core';
import {ChartCommonModule} from '../common/chart/common-chart.module';
import {HeatMapGridComponent} from './heat-map-grid.component';
import {CommonAxisModule} from '../common/axis/common-axis.module';
import {CommonHeatmapCircleModule} from '../common/heatmap-circles/common-heatmap-circles.module';
import {CommonTooltipModule} from '../common/tooltip/common-tooltip.module';

export {HeatMapGridComponent};

const COMPONENTS = [HeatMapGridComponent];

@NgModule({
	imports: [ChartCommonModule, CommonHeatmapCircleModule, CommonAxisModule, CommonTooltipModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class HeatMapGridModule {
}
