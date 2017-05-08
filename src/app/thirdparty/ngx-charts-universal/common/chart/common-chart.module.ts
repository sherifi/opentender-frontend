import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ChartComponent} from './chart.component';
import {BaseChartComponent} from './base-chart.component';
import {CommonLegendModule} from '../legend/common-legend.module';

const COMPONENTS = [BaseChartComponent, ChartComponent];

@NgModule({
	imports: [CommonModule, CommonLegendModule],
	declarations: [...COMPONENTS],
	exports: [CommonModule, ...COMPONENTS]
})
export class ChartCommonModule {
}
