import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommonGradientModule} from '../gradient/common-gradient.module';
import {AreaComponent} from './area.component';
import {AreaSeriesComponent} from './area-series.component';
import {AreaTooltipComponent} from './area-tooltip.component';
import {CommonTooltipModule} from '../tooltip/common-tooltip.module';
import {CommonTimelineModule} from '../timeline/common-timeline.module';

const COMPONENTS = [AreaComponent, AreaSeriesComponent, AreaTooltipComponent];

@NgModule({
	imports: [CommonModule, CommonGradientModule, CommonTimelineModule, CommonTooltipModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class CommonAreaModule {
}
