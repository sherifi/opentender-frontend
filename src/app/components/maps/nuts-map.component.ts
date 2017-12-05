import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {IApiResultGeoJSON, ISeriesProvider, IStatsNuts} from '../../app.interfaces';
import {PlatformService} from '../../services/platform.service';
import {ApiService} from '../../services/api.service';
import * as d3chroma from 'd3-scale-chromatic/build/d3-scale-chromatic';
import {scaleLinear} from 'd3-scale';
import {NotifyService} from '../../services/notify.service';
import {Utils} from '../../model/utils';
import {initLeafletPlugins} from './leaflet.helper';

/// <reference path="../../../../node_modules/@types/leaflet/index.d.ts" />
declare let L;

@Component({
	selector: 'graph[nutsmap]',
	template: `
		<div class="nutsmap_containers" style="height: 376px">
			<div leaflet class="nutsmap_leaflet" [leafletOptions]="leaflet_options" (leafletMapReady)="onMapReady($event)"></div>
			<div *ngIf="data_list.length===0" class="nutsmap_placeholder" style="line-height: 376px">NO DATA</div>
		</div>
		<div class="nutsmap_legend" *ngIf="!hideLegend && data_list.length>0">
			<span>{{valueLow | formatNumber}}</span>
			<svg width="200" height="16">
				<defs>
					<linearGradient id="legendGradient" x1="0%" x2="100%" y1="0%" y2="0%">
						<stop offset="0" [attr.stop-color]="colorLow" stop-opacity="0.3"></stop>
						<stop offset="1" [attr.stop-color]="colorHigh" stop-opacity="1"></stop>
					</linearGradient>
				</defs>
				<rect fill="url(#legendGradient)" x="0" y="0" width="200" height="16"></rect>
			</svg>
			<span>{{valueHigh | formatNumber}}</span>
		</div>
		<div class="nutsmap_subtitle"><a [routerLink]="['about/how-opentender-works']" pageScroll="#info-maps">Sources</a></div>
		<select-series-download-button *ngIf="!hideLegend && data_list.length>0" [sender]="this"></select-series-download-button>`
})
export class MapComponent implements OnChanges, ISeriesProvider {
	@Input()
	data: IStatsNuts;
	@Input()
	level: number = 1;
	@Input()
	formatTooltip: (properties: any) => string;
	@Input()
	title: string;
	@Input()
	hideLegend: boolean = false;

	private colorLow: string = '';
	private valueLow: number;
	private colorHigh: string = '';
	private valueHigh: number;

	public loading: number = 0;
	public resetZoom: boolean = true;
	private map: any;
	private resetControl: any;
	private geolayer: L.GeoJSON;
	public leaflet_options = {};
	public data_list = [];

	constructor(private api: ApiService, private platform: PlatformService, private router: Router, private notify: NotifyService) {
		this.initMap();
	}

	initMap() {
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
				let popup = layer.bindPopup(tooltip, {closeButton: false, autoPan: false, className: 'nutsmap_popup'});
				layer.on('mouseover', (e) => {
					popup.openPopup();
				});
				layer.on('mouseout', (e) => {
					popup.closePopup();
				});
				layer.on('click', (e) => {
					this.router.navigate(['/region/' + feature.properties['id']]);
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
			minZoom: 2,
			maxZoom: 10,
			fullscreenControl: true,
			resetControl: false,
			scrollWheelZoom: false,
			center: L.latLng({lat: 52.520645, lng: 13.409779})
		};
	}

	getSeriesInfo() {
		return {data: this.data_list, header: {id: 'NUTS' + this.level, value: 'Amount', name: 'Name'}, filename: this.title};
	}

	displayNuts(geo: IApiResultGeoJSON) {
		let nuts = {};
		Object.keys(this.data).forEach(key => {
			let nutskey = Utils.validateNutsCode(key, this.level);
			let nut = nuts[nutskey];
			if (!nut) {
				nut = {
					id: nutskey,
					feature: geo.features.find(f => f.properties.id === nutskey),
					value: 0
				};
				nuts[nutskey] = nut;
			}
			nut.value = nut.value + this.data[key];
		});
		let max = 0;
		let min = 0;
		let list = Object.keys(nuts).map(key => nuts[key]).filter(nut => nut.feature);
		if (list.length > 0) {
			min = list[0].value;
			max = list[0].value;
		}
		list.forEach(nut => {
			min = Math.min(nut.value, min);
			max = Math.max(nut.value, max);
		});
		let scale = scaleLinear().domain([0, max]).range([0, 1]);
		this.colorLow = d3chroma.interpolateBlues(scale(min));
		this.valueLow = 0;
		this.colorHigh = d3chroma.interpolateBlues(scale(max));
		this.valueHigh = max;
		this.data_list = list.map(nut => {
			return {id: nut.id, name: nut.feature.properties.name, value: nut.value};
		});
		let newgeo = {
			crs: geo.crs,
			type: geo.type,
			features: list.map(nut => {
				let feature = {
					properties: {
						id: nut.feature.properties.id,
						name: nut.feature.properties.name,
						value: nut.value,
						color: d3chroma.interpolateBlues(scale(nut.value))
					},
					type: nut.feature.type,
					geometry: nut.feature.geometry
				};
				return feature;
			})
		};
		this.geolayer.clearLayers();
		if (newgeo.features.length > 0) {
			this.geolayer.addData(newgeo);
			if (this.resetZoom) {
				this.map.fitBounds(this.geolayer.getBounds());
			}
		}
	}

	resetView() {
		this.resetZoom = true;
		this.map.fitBounds(this.geolayer.getBounds());
	}

	initResetViewButton() {
		if (!this.resetControl) {
			this.resetControl = new L.Control.Reset({
				position: 'topright',
				title: 'Reset Map',
				onClick: this.resetView.bind(this)
			});
			this.map.addControl(this.resetControl);
		}
	}

	loadMap() {
		this.loading++;
		this.api.getNutsMap(this.level).subscribe(
			(result) => {
				this.displayNuts(result);
			},
			(error) => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
			});
	}

	onMapReady(map) {
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

	ngOnChanges(changes: SimpleChanges): void {
		if (!this.platform.isBrowser) {
			return;
		}
		if (this.data) {
			this.loadMap();
		}
	}

}
