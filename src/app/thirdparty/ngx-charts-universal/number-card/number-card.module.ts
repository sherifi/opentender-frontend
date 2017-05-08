import {NgModule} from '@angular/core';
import {ChartCommonModule} from '../common/chart/common-chart.module';
import {NumberCardComponent} from './number-card.component';
import {CommonCardModule} from '../common/card/common-card.module';

export {NumberCardComponent};

const COMPONENTS = [NumberCardComponent];

@NgModule({
	imports: [ChartCommonModule, CommonCardModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class NumberCardModule {
}
