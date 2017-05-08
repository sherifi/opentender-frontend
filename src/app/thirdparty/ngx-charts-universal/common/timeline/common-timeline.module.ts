import {NgModule} from '@angular/core';
import {TimelineComponent} from './timeline.component';
import {CommonModule} from '@angular/common';

const COMPONENTS = [TimelineComponent];

@NgModule({
	imports: [CommonModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class CommonTimelineModule {
}
