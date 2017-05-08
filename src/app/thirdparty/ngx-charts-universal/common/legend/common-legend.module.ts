import {NgModule} from '@angular/core';

import {CommonGradientModule} from '../gradient/common-gradient.module';
import {CommonModule} from '@angular/common';
import {CommonTooltipModule} from '../tooltip/common-tooltip.module';
import {ScaleLegendComponent} from './scale-legend.component';
import {LegendEntryComponent} from './legend-entry.component';
import {AdvancedLegendComponent} from './advanced-legend.component';
import {LegendComponent} from './legend.component';
import {CommonCountModule} from '../count/common-count.module';

const COMPONENTS = [LegendComponent, AdvancedLegendComponent, LegendEntryComponent, ScaleLegendComponent];

@NgModule({
	imports: [CommonModule, CommonGradientModule, CommonTooltipModule, CommonCountModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class CommonLegendModule {
}
