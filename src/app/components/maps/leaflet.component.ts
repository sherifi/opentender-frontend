import {Component, Input, Output, EventEmitter, ViewEncapsulation, OnChanges, SimpleChanges} from '@angular/core';
import {initLeafletPlugins} from './leaflet.helper';
import {PlatformService} from '../../services/platform.service';

/// <reference path="../../../../node_modules/@types/leaflet/index.d.ts" />
declare let L;

@Component({
	selector: 'leafletmap',
	template: `
		<div class="map_containers" [style.height.px]="height">
			<div leaflet class="map_leaflet" [leafletOptions]="leaflet_options" [style.height.px]="height" (leafletMapReady)="onMapReady($event)"></div>
			<div *ngIf="empty" class="map_placeholder" [style.line-height.px]="height">NO DATA</div>
		</div>`,
	styleUrls: ['leaflet.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnChanges {
	@Input() geo: any;
	@Input() settings: {
		url: string;
		center: [number, number],
		noAutoZoom: boolean
	};
	@Input() empty: boolean = false;
	@Input() height: number = 376;
	@Input() formatTooltip: (properties: any) => string;
	@Output() regionClick = new EventEmitter();
	public leaflet_options: any = {};
	public resetZoom: boolean = true;
	private geolayer: L.GeoJSON;
	private map: any;
	private resetControl: any;

	constructor(private platform: PlatformService) {
		if (!this.platform.isBrowser) {
			return;
		}
		initLeafletPlugins();
		this.geolayer = L.geoJSON(null, {
			onEachFeature: ((feature, layer) => {
				let tooltip;
				if (this.formatTooltip) {
					tooltip = this.formatTooltip(feature.properties);
				} else {
					tooltip = feature.properties['name'] + ': ' + feature.properties['value'];
				}
				let popup = layer.bindPopup(tooltip, {closeButton: false, autoPan: false, className: 'map_popup'});
				layer.on('mouseover', (e) => {
					popup.openPopup();
				});
				layer.on('mouseout', (e) => {
					popup.closePopup();
				});
				layer.on('click', (e) => {
					this.regionClick.emit(feature);
				});
			}),
			style: (feature) => {
				return {weight: 1, color: feature.properties['border'], fillColor: feature.properties['color'], opacity: 0.9, fillOpacity: 0.55};
			}
		});
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (!this.platform.isBrowser) {
			return;
		}
		if (changes['settings']) {
			this.updateSettings();
		}
		if (changes['geo']) {
			this.updateGeo();
		}
	}

	private updateGeo() {
		setTimeout(() => {
			this.geolayer.clearLayers();
			if (this.geo && this.geo.features.length > 0) {
				this.geolayer.addData(this.geo);
				if (this.resetZoom && !this.settings.noAutoZoom) {
					this.map.fitBounds(this.geolayer.getBounds());
				}
			}
			this.map.invalidateSize();
		});
	}

	private updateSettings() {
		this.leaflet_options = {
			layers: [
				L.tileLayer(this.settings.url, {maxZoom: 18, attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'}),
				this.geolayer
			],
			zoom: 3,
			minZoom: 2,
			maxZoom: 10,
			fullscreenControl: true,
			resetControl: false,
			scrollWheelZoom: false,
			center: L.latLng({lat: this.settings.center[0], lng: this.settings.center[1]})
		};
	}

	private initResetViewButton() {
		if (!this.resetControl) {
			this.resetControl = new L.Control.Reset({
				position: 'topright',
				title: 'Reset Map',
				onClick: this.resetView.bind(this)
			});
			this.map.addControl(this.resetControl);
		}
	}

	public resetView() {
		this.resetZoom = true;
		this.map.fitBounds(this.geolayer.getBounds());
	}

	public onMapReady(map): void {
		this.map = map;
		map.once('focus', () => {
			map.scrollWheelZoom.enable();
			this.resetZoom = false;
			this.initResetViewButton();
		});
		map.on('mousedown', () => {
			this.resetZoom = false;
		});
	}
}
