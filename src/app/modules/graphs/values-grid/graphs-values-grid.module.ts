import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TreeMapModule} from '../../../thirdparty/ngx-charts-universal/tree-map/tree-map.module';
import {CommonTooltipModule} from '../../../thirdparty/ngx-charts-universal/common/tooltip/common-tooltip.module';
import {GraphScoreGridComponent} from './score-grid.component';
import {ValuesGridModule} from '../../../thirdparty/ngx-charts-universal/values-grid/values-grid.module';

@NgModule({
	imports: [
		CommonModule,
		TreeMapModule,
		ValuesGridModule,
		CommonTooltipModule
	],
	declarations: [
		GraphScoreGridComponent
	],
	exports: [
		GraphScoreGridComponent
	]
})
export class GraphsValuesGridModule {
}
