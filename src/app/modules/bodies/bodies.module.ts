import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BodyAddressComponent} from './body-address/body-address.component';
import {SelectSimilarListComponent} from './similar-list/select-similar-list.component';
import {PipesModule} from '../pipes/pipes.module';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		PipesModule,
		RouterModule
	],
	declarations: [
		SelectSimilarListComponent,
		BodyAddressComponent
	],
	exports: [
		SelectSimilarListComponent,
		BodyAddressComponent
	]
})
export class BodiesModule {
}
