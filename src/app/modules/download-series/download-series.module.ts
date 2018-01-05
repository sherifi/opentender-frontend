import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectDownloadSeriesComponent} from './download-series.component';
import {DialogModule} from '../dialog/dialog.module';

@NgModule({
	imports: [
		CommonModule,
		DialogModule
	],
	declarations: [
		SelectDownloadSeriesComponent
	],
	exports: [
		SelectDownloadSeriesComponent
	],
	providers: [
	]
})
export class DownloadSeriesModule {
}
