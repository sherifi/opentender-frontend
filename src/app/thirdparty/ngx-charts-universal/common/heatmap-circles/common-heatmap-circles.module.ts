import {NgModule} from '@angular/core';
import {CommonGradientModule} from '../gradient/common-gradient.module';
import {CommonModule} from '@angular/common';
import {CommonTooltipModule} from '../tooltip/common-tooltip.module';
import {HeatMapCircleCellSeriesComponent} from './heat-map-circle-cell-series.component';
import {HeatMapCircleCellComponent} from './heat-map-circle-cell.component';
import {CommonCircleModule} from '../circle/common-circle.module';

const COMPONENTS = [HeatMapCircleCellComponent, HeatMapCircleCellSeriesComponent];

@NgModule({
	imports: [CommonModule, CommonTooltipModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class CommonHeatmapCircleModule {
}
