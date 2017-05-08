import {NgModule} from '@angular/core';
import {GridPanelComponent} from './grid-panel.component';
import {GridPanelSeriesComponent} from './grid-panel-series.component';
import {CommonModule} from '@angular/common';

const COMPONENTS = [GridPanelComponent, GridPanelSeriesComponent];

@NgModule({
	imports: [CommonModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class CommonGridModule {
}
