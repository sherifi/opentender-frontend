import {NgModule} from '@angular/core';
import {ChartCommonModule} from '../common/chart/common-chart.module';
import {HeatMapComponent} from './heat-map.component';
import {CommonHeatmapModule} from '../common/heatmap/common-heatmap.module';
import {CommonAxisModule} from '../common/axis/common-axis.module';

export {HeatMapComponent};

const COMPONENTS = [HeatMapComponent];

@NgModule({
	imports: [ChartCommonModule, CommonHeatmapModule, CommonAxisModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class HeatMapModule {
}
