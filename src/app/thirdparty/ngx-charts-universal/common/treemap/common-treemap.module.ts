import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TreeMapCellComponent, MeasureDirective} from './tree-map-cell.component';
import {TreeMapCellSeriesComponent} from './tree-map-cell-series.component';
import {CommonTooltipModule} from '../tooltip/common-tooltip.module';
import {CommonCountModule} from '../count/common-count.module';

const COMPONENTS = [TreeMapCellSeriesComponent, TreeMapCellComponent];

@NgModule({
	imports: [CommonModule, CommonTooltipModule, CommonCountModule],
	declarations: [...COMPONENTS, MeasureDirective],
	exports: [...COMPONENTS]
})
export class CommonTreemapModule {
}
