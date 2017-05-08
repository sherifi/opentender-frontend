import {NgModule} from '@angular/core';
import {CardComponent} from './card.component';
import {CardSeriesComponent} from './card-series.component';
import {CommonModule} from '@angular/common';

const COMPONENTS = [CardComponent, CardSeriesComponent];

@NgModule({
	imports: [CommonModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class CommonCardModule {
}
