import {NgModule} from '@angular/core';
import {ForceDirectedGraphComponent} from './force-directed-graph.component';
import {ChartCommonModule} from '../common/chart/common-chart.module';
import {CommonTooltipModule} from '../common/tooltip/common-tooltip.module';

export {ForceDirectedGraphComponent};
const COMPONENTS = [ForceDirectedGraphComponent];

@NgModule({
	imports: [ChartCommonModule, CommonTooltipModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class ForceDirectedGraphModule {
}
