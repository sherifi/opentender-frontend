import {NgModule} from '@angular/core';
import {HeatMapCellComponent} from './heat-map-cell.component';
import {HeatCellSeriesComponent} from './heat-map-cell-series.component';
import {CommonGradientModule} from '../gradient/common-gradient.module';
import {CommonModule} from '@angular/common';
import {CommonTooltipModule} from '../tooltip/common-tooltip.module';

const COMPONENTS = [HeatMapCellComponent, HeatCellSeriesComponent];

@NgModule({
	imports: [CommonModule, CommonGradientModule, CommonTooltipModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class CommonHeatmapModule {
}
