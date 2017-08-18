import {NgModule} from '@angular/core';
import {ChartCommonModule} from '../common/chart/common-chart.module';
import {BarHorizontalComponent} from './bar-horizontal.component';
import {BarVerticalComponent} from './bar-vertical.component';
import {BarHorizontalLabeledComponent} from './bar-horizontal-labeled.component';
import {BarHorizontalStackedComponent} from './bar-horizontal-stacked.component';
import {BarVerticalStackedComponent} from './bar-vertical-stacked.component';
import {BarHorizontalGroupedComponent} from './bar-horizontal-grouped.component';
import {BarVerticalGroupedComponent} from './bar-vertical-grouped.component';
import {CommonBarModule} from '../common/bar/common-bar.module';
import {CommonGridModule} from '../common/grid/common-grid.module';
import {CommonAxisModule} from '../common/axis/common-axis.module';
import {BaseBarGroupedComponent} from './base-bar-grouped-chart.component';

export {
	BarHorizontalComponent, BarVerticalComponent,
	BarHorizontalStackedComponent, BarVerticalStackedComponent,
	BarHorizontalGroupedComponent, BarVerticalGroupedComponent,
	BarHorizontalLabeledComponent
};

const COMPONENTS = [BarHorizontalComponent, BarVerticalComponent,
	BarHorizontalStackedComponent, BarVerticalStackedComponent, BarHorizontalLabeledComponent,
	BarHorizontalGroupedComponent, BarVerticalGroupedComponent, BaseBarGroupedComponent];

@NgModule({
	imports: [ChartCommonModule, CommonBarModule, CommonGridModule, CommonAxisModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class BarChartModule {
}
