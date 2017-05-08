import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GaugeArcComponent} from './gauge-arc.component';
import {GaugeAxisComponent} from './gauge-axis.component';
import {CommonPieModule} from '../pie/common-pie.module';

const COMPONENTS = [GaugeArcComponent, GaugeAxisComponent];

@NgModule({
	imports: [CommonModule, CommonPieModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class CommonGaugeModule {
}
