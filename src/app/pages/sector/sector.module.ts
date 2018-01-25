import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {routing} from './sector.routing';
import {RouterModule} from '@angular/router';
import {PipesModule} from '../../modules/pipes/pipes.module';
import {DialogModule} from '../../modules/dialog/dialog.module';
import {MapsModule} from '../../modules/maps/maps.module';
import {SectorPage} from './sector.component';
import {TableModule} from '../../modules/tables/table.module';
import {SelectYearRangeModule} from '../../modules/select-year-range/select-year-range.module';
import {GraphsTreeMapModule} from '../../modules/graphs/tree-map/graphs-treemap.module';
import {GraphsBarModule} from '../../modules/graphs/bar/graphs-bar.module';
import {LoadingModule} from '../../modules/loading/loading.module';
import {BreadcrumbModule} from '../../modules/breadcrumb/breadcrumb.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		PipesModule,
		GraphsTreeMapModule,
		GraphsBarModule,
		BreadcrumbModule,
		TableModule,
		SelectYearRangeModule,
		MapsModule,
		LoadingModule,
		DialogModule,
		routing
	],
	declarations: [
		SectorPage
	]
})
export class SectorModule {
}
