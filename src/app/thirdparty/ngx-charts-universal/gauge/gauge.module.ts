import {NgModule} from '@angular/core';
import {ChartCommonModule} from '../common/chart/common-chart.module';
import {LinearGaugeComponent} from './gauge-linear.component';
import {GaugeComponent} from './gauge.component';
import {CommonGaugeModule} from '../common/gauge/common-gauge.module';
import {CommonBarModule} from '../common/bar/common-bar.module';

export {GaugeComponent, LinearGaugeComponent};

const COMPONENTS = [LinearGaugeComponent, GaugeComponent];

@NgModule({
	imports: [ChartCommonModule, CommonGaugeModule, CommonBarModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]

})
export class GaugeModule {
}
