import {NgModule} from '@angular/core';
import {AreaChartComponent} from './area-chart.component';
import {AreaChartNormalizedComponent} from './area-chart-normalized.component';
import {AreaChartStackedComponent} from './area-chart-stacked.component';
import {ChartCommonModule} from '../common/chart/common-chart.module';
import {CommonAreaModule} from '../common/area/common-area.module';
import {CommonAxisModule} from '../common/axis/common-axis.module';
import {CommonTimelineModule} from '../common/timeline/common-timeline.module';
import {CommonCircleModule} from '../common/circle/common-circle.module';

export {AreaChartComponent, AreaChartNormalizedComponent, AreaChartStackedComponent};

const COMPONENTS = [AreaChartComponent, AreaChartNormalizedComponent, AreaChartStackedComponent];

@NgModule({
	imports: [ChartCommonModule, CommonAreaModule, CommonAxisModule, CommonTimelineModule, CommonCircleModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class AreaChartModule {
}
