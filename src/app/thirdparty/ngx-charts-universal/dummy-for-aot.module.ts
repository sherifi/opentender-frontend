import {NgModule} from '@angular/core';
import {BaseAreaChartComponent} from './area-chart/base-area-chart.component';
import {BaseXYAxisComponent} from './common/chart/base-axes-chart.component';

const COMPONENTS = [BaseXYAxisComponent, BaseAreaChartComponent];

@NgModule({
	imports: [],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class DummyForAotModule {
}
