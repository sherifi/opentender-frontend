import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DownloadSeriesModule} from '../../download-series/download-series.module';
import {CommonTooltipModule} from '../../../thirdparty/ngx-charts-universal/common/tooltip/common-tooltip.module';
import {BarChartModule} from '../../../thirdparty/ngx-charts-universal/bar-chart/bar-chart.module';
import {GraphBenchmarksComponent} from './benchmarks.component';
import {FormsModule} from '@angular/forms';


@NgModule({
	imports: [
		CommonModule,
		DownloadSeriesModule,
		BarChartModule,
		FormsModule,
		CommonTooltipModule
	],
	declarations: [
		GraphBenchmarksComponent
	],
	exports: [
		GraphBenchmarksComponent
	]
})
export class GraphsBarGroupedModule {
}
