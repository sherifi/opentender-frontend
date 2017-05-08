import {NgModule} from '@angular/core';
import {ChartCommonModule} from '../common/chart/common-chart.module';
import {PieChartAdvancedComponent} from './pie-chart-advanced.component';
import {PieChartComponent} from './pie-chart.component';
import {PieGridComponent} from './pie-chart-grid.component';
import {CommonPieModule} from '../common/pie/common-pie.module';
import {CommonLegendModule} from '../common/legend/common-legend.module';
import {CommonCountModule} from '../common/count/common-count.module';
import {CommonTooltipModule} from '../common/tooltip/common-tooltip.module';
import {BasePieChartComponent} from './pie-chart-base.component';

export {PieChartAdvancedComponent, PieChartComponent, PieGridComponent};

const COMPONENTS = [PieChartAdvancedComponent, PieChartComponent, PieGridComponent, BasePieChartComponent];

@NgModule({
	imports: [ChartCommonModule, CommonPieModule, CommonLegendModule, CommonCountModule, CommonTooltipModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class PieChartModule {
}
