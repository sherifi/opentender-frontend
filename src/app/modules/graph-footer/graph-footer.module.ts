import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GraphFooterComponent} from './graph-footer.component';
import {DialogModule} from '../dialog/dialog.module';
import {RouterModule} from '@angular/router';
import {PageScrollModule} from '../page-scroll/page-scroll.module';
import {PipesModule} from '../pipes/pipes.module';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		PageScrollModule,
		PipesModule,
		DialogModule
	],
	declarations: [
		GraphFooterComponent
	],
	exports: [
		GraphFooterComponent
	],
	providers: [
	]
})
export class GraphFooterModule {
}
