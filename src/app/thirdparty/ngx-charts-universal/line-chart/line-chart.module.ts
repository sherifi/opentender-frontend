import {NgModule} from '@angular/core';
import {ChartCommonModule} from '../common/chart/common-chart.module';
import {LineChartComponent} from './line-chart.component';
import {CommonLineModule} from '../common/line/common-line.module';
import {CommonTimelineModule} from '../common/timeline/common-timeline.module';
import {CommonCircleModule} from '../common/circle/common-circle.module';
import {CommonAxisModule} from '../common/axis/common-axis.module';
import {CommonAreaModule} from '../common/area/common-area.module';

export {LineChartComponent};

const COMPONENTS = [LineChartComponent];

@NgModule({
	imports: [ChartCommonModule, CommonLineModule, CommonCircleModule, CommonAxisModule, CommonTimelineModule, CommonAreaModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class LineChartModule {
}

