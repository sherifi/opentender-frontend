import {NgModule} from '@angular/core';
import {LineComponent} from './line.component';
import {LineSeriesComponent} from './line-series.component';
import {CommonModule} from '@angular/common';
import {CommonGradientModule} from '../gradient/common-gradient.module';
import {CommonAreaModule} from '../area/common-area.module';
import {CommonTimelineModule} from '../timeline/common-timeline.module';
import {CommonCircleModule} from '../circle/common-circle.module';

const COMPONENTS = [LineComponent, LineSeriesComponent];

@NgModule({
	imports: [CommonModule, CommonGradientModule, CommonAreaModule, CommonTimelineModule, CommonCircleModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class CommonLineModule {
}
