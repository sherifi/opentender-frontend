import {NgModule} from '@angular/core';
import {ChartCommonModule} from '../common/chart/common-chart.module';
import {CommonLegendModule} from '../common/legend/common-legend.module';
import {CommonTooltipModule} from '../common/tooltip/common-tooltip.module';
import {ValuesGridComponent} from './values-grid.component';
import {ValuesGridSeriesComponent} from './values-grid-series';

export {ValuesGridComponent};

const COMPONENTS = [ValuesGridComponent];

@NgModule({
	imports: [ChartCommonModule, CommonLegendModule, CommonTooltipModule],
	declarations: [ValuesGridSeriesComponent, ...COMPONENTS],
	exports: [...COMPONENTS]
})
export class ValuesGridModule {
}
