import {ModuleWithProviders, NgModule, Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';

@Directive({
	selector: '[leaflet]'
})
export class LeafletDirective {

	readonly DEFAULT_FPZ_OPTIONS = {};

	element: ElementRef;

	// Reference to the primary map object
	map: any;

	@Input('leafletFitBoundsOptions') fitBoundsOptions = this.DEFAULT_FPZ_OPTIONS;
	@Input('leafletPanOptions') panOptions = this.DEFAULT_FPZ_OPTIONS;
	@Input('leafletZoomOptions') zoomOptions = this.DEFAULT_FPZ_OPTIONS;
	@Input('leafletZoomPanOptions') zoomPanOptions = this.DEFAULT_FPZ_OPTIONS;


	// Default configuration
	@Input('leafletOptions') options = {};

	// Configure callback function for the map
	@Output('leafletMapReady') mapReady = new EventEmitter<any>();

	// Zoom level for the map
	@Input('leafletZoom') zoom: number;

	// Center the map
	@Input('leafletCenter') center: any;

	// Set fit bounds for map
	@Input('leafletFitBounds') fitBounds: any;


	constructor(el: ElementRef) {
		this.element = el;
	}

	public getMap() {
		return null;
	}

}


@NgModule({
	exports: [
		LeafletDirective
	],
	declarations: [
		LeafletDirective
	]
})

export class NoopLeafletModule {

	static forRoot(): ModuleWithProviders {
		return {ngModule: NoopLeafletModule, providers: []};
	}

}
