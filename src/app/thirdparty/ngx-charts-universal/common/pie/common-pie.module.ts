import {NgModule} from '@angular/core';
import {PieArcComponent} from './pie-arc.component';
import {PieGridSeriesComponent} from './pie-grid-series.component';
import {PieLabelComponent} from './pie-label.component';
import {PieSeriesComponent} from './pie-series.component';
import {CommonGradientModule} from '../gradient/common-gradient.module';
import {CommonModule} from '@angular/common';
import {CommonTooltipModule} from '../tooltip/common-tooltip.module';
import {CommonLegendModule} from '../legend/common-legend.module';

const COMPONENTS = [PieArcComponent, PieGridSeriesComponent, PieLabelComponent, PieSeriesComponent];

@NgModule({
	imports: [CommonModule, CommonGradientModule, CommonTooltipModule, CommonLegendModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class CommonPieModule {
}
