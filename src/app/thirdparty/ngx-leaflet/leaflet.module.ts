import { ModuleWithProviders, NgModule } from '@angular/core';

import { LeafletDirective } from './core/leaflet.directive';
import { LeafletLayerDirective } from './layers/leaflet-layer.directive';
import { LeafletLayersDirective } from './layers/leaflet-layers.directive';
import { LeafletLayersControlDirective } from './layers/control/leaflet-control-layers.directive';
import { LeafletBaseLayersDirective } from './layers/base/leaflet-baselayers.directive';
import '../leaflet/control/index';
import '../leaflet/core/index';
import '../leaflet/geometry/index';
import '../leaflet/geo/index';
import '../leaflet/layer/index';
import '../leaflet/map/index';
import {freeze} from '../leaflet/core/Util';
Object.freeze = freeze;

@NgModule({
	exports: [
		LeafletDirective,
		LeafletLayerDirective,
		LeafletLayersDirective,
		LeafletLayersControlDirective,
		LeafletBaseLayersDirective
	],
	declarations: [
		LeafletDirective,
		LeafletLayerDirective,
		LeafletLayersDirective,
		LeafletLayersControlDirective,
		LeafletBaseLayersDirective
	]
})
export class NGXLeafletModule {

	static forRoot(): ModuleWithProviders {
		return { ngModule: NGXLeafletModule, providers: [] };
	}

}
