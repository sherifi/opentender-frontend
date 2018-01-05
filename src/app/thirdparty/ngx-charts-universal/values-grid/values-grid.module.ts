import {NgModule} from '@angular/core';
import {ChartCommonModule} from '../common/chart/common-chart.module';
import {CommonLegendModule} from '../common/legend/common-legend.module';
import {CommonTooltipModule} from '../common/tooltip/common-tooltip.module';
import {ValuesGridComponent} from './values-grid.component';
import {CommonPieModule} from '../common/pie/common-pie.module';

export {ValuesGridComponent};

const COMPONENTS = [ValuesGridComponent];

@NgModule({
	imports: [ChartCommonModule, CommonPieModule, CommonLegendModule, CommonTooltipModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class ValuesGridModule {
}
