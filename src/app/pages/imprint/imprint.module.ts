import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {routing} from './imprint.routing';
import {PipesModule} from '../../modules/pipes/pipes.module';
import {ImprintPage} from './imprint.component';

@NgModule({
	imports: [
		CommonModule,
		PipesModule,
		routing
	],
	declarations: [
		ImprintPage
	]
})
export class ImprintModule {
}
