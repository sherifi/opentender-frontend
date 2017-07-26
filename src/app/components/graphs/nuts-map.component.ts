import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IApiGeoJSONResult, IStatsNuts} from '../../app.interfaces';
import {PlatformService} from '../../services/platform.service';
import {ApiService} from '../../services/api.service';
import GeoJSON = L.GeoJSON;
import * as d3chroma from 'd3-scale-chromatic/build/d3-scale-chromatic';
import * as d3 from 'd3';

@Component({
	selector: 'graph[nutsmap]',
	template: `
		<div class="nutsmap_containers" style="height: 360px">
			<div leaflet class="nutsmap_leaflet" [leafletOptions]="leaflet_options" (leafletMapReady)="onMapReady($event)"></div>
			<div *ngIf="valid===0" class="nutsmap_placeholder" style="line-height: 360px">NO DATA</div>
		</div>
		<div class="nutsmap_subtitle">Administrative boundaries: © GISCO - Eurostat © EuroGeographics © UN-FAO © Turkstat</div>
		<div *ngIf="invalid>0" class="nutsmap_subtitle">{{invalid}} invalid NUTS codes</div>
	`
})
export class GraphNutsMapComponent implements OnChanges {
	@Input()
	data: IStatsNuts;
	@Input()
	level: number = 1;
	@Input()
	formatTooltip: any;

	private invalid: number = 0;
	private valid: number = 0;
	private map: any;
	private geolayer: GeoJSON;
	private leaflet_options = {};

	constructor(private api: ApiService, private platform: PlatformService) {
		this.initMap();
	}

	initMap() {
		if (!this.platform.isBrowser) {
			return;
		}
		this.geolayer =
			L.geoJSON(null, {
				onEachFeature: ((feature, layer) => {
					let tooltip;
					if (this.formatTooltip) {
						tooltip = this.formatTooltip(feature.properties);
					} else {
						tooltip = feature.properties['name'] + ': ' + feature.properties['value'];
					}
					let popup = layer.bindPopup(tooltip, {closeButton: false, autoPan: false, className: 'nutsmap_popup'});
					layer.on('mouseover', (e) => {
						popup.openPopup();
					});
					layer.on('mouseout', (e) => {
						popup.closePopup();
					});
				}),
				style: (feature) => {
					return {weight: 1, color: '#a4a4a4', fillColor: feature.properties['color'], opacity: 0.9, fillOpacity: 0.55};
				}
			});
		this.leaflet_options = {
			layers: [
				L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'}),
				this.geolayer
			],
			zoom: 3,
			center: L.latLng({lat: 52.520645, lng: 13.409779})
		};
	}

	displayNuts(geo: IApiGeoJSONResult) {
		let nuts = {};
		let max = 0;
		Object.keys(this.data).forEach(key => {
			let nutskey = this.validateNutsCode(key, this.level);
			nuts[nutskey] = (nuts[nutskey] || 0) + this.data[key];
			max = Math.max(max, nuts[nutskey]);
		});
		let scale = d3.scaleLinear().domain([0, max]).range([0, 1]);
		this.valid = 0;
		geo.features = geo.features.filter(feature => {
			let value = nuts[feature.properties.id];
			if (value > 0) {
				delete nuts[feature.properties.id];
				feature.properties['value'] = value;
				feature.properties['color'] = d3chroma.interpolateBlues(scale(value));
				this.valid += value;
				return true;
			}
			return false;
		});
		this.invalid = 0;
		if (Object.keys(nuts).length > 0) {
			Object.keys(nuts).forEach(key => {
				this.invalid += nuts[key];
			});
			// console.log('unused', nuts);
		}
		if (geo.features.length > 0) {
			this.geolayer.clearLayers();
			this.geolayer.addData(geo);
			this.map.fitBounds(this.geolayer.getBounds());
		}
	}

	validateNutsCode(code, level) {
		if (code.length > 1 && code.length < 6) {
			code = code.toUpperCase();
			if (code.match(/[A-Z]{2}[A-Z0-9]{0,3}/)) {
				return code.slice(0, 2 + level);
			}
		}
		// console.log('invalid code', code);
		return 'invalid';
	}

	loadMap() {
		this.api.getNutsMap(this.level).subscribe(
			result => {
				this.displayNuts(result);
			},
			error => {
				console.error(error);
			},
			() => {
				// console.log('nuts map complete');
			});
	}

	onMapReady(map) {
		this.map = map;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (!this.platform.isBrowser) {
			return;
		}
		if (this.data) {
			this.loadMap();
		}
	}

}
