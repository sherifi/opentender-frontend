import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AxisLabelComponent} from './axis-label.component';
import {XAxisComponent} from './x-axis.component';
import {XAxisTicksComponent} from './x-axis-ticks.component';
import {YAxisComponent} from './y-axis.component';
import {YAxisTicksComponent} from './y-axis-ticks.component';

const COMPONENTS = [AxisLabelComponent, XAxisComponent, XAxisTicksComponent, YAxisComponent, YAxisTicksComponent];

@NgModule({
	imports: [CommonModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class CommonAxisModule {
}
