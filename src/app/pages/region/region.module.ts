import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {routing} from './region.routing';
import {RouterModule} from '@angular/router';
import {PipesModule} from '../../modules/pipes/pipes.module';
import {DialogModule} from '../../modules/dialog/dialog.module';
import {MapsModule} from '../../modules/maps/maps.module';
import {RegionPage} from './region.component';
import {TableModule} from '../../modules/tables/table.module';
import {GraphsBarModule} from '../../modules/graphs/bar/graphs-bar.module';
import {LoadingModule} from '../../modules/loading/loading.module';
import {BreadcrumbModule} from '../../modules/breadcrumb/breadcrumb.module';
import {GraphsBarGroupedModule} from '../../modules/graphs/bar-grouped/graphs-bar-grouped.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		PipesModule,
		GraphsBarModule,
		GraphsBarGroupedModule,
		BreadcrumbModule,
		MapsModule,
		TableModule,
		DialogModule,
		LoadingModule,
		routing
	],
	declarations: [
		RegionPage
	]
})
export class RegionModule {
}
