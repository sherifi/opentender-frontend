import {CommonModule} from '@angular/common';
import {NgModule, ModuleWithProviders} from '@angular/core';

import {TypeaheadContainerComponent} from './typeahead-container.component';
import {TypeaheadDirective} from './typeahead.directive';
import {ComponentLoaderFactory} from './component-loader.factory';
import {PositioningService} from './positioning.service';

@NgModule({
	imports: [CommonModule],
	declarations: [TypeaheadContainerComponent, TypeaheadDirective],
	exports: [TypeaheadContainerComponent, TypeaheadDirective],
	entryComponents: [TypeaheadContainerComponent],
	providers: [ComponentLoaderFactory, PositioningService]
})
export class TypeaheadModule {
	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: TypeaheadModule
		};
	}
}
