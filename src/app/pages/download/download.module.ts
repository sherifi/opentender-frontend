import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {routing} from './download.routing';
import {PipesModule} from '../../modules/pipes/pipes.module';
import {DownloadPage} from './download.component';
import {BreadcrumbModule} from '../../modules/breadcrumb/breadcrumb.module';

@NgModule({
	imports: [
		CommonModule,
		PipesModule,
		BreadcrumbModule,
		routing
	],
	declarations: [
		DownloadPage
	]
})
export class DownloadModule {
}
