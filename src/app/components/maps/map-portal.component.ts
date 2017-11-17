import {Component, Input, AfterViewInit, OnChanges, SimpleChanges} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {IApiResultGeoJSON, IStatsCountry} from '../../app.interfaces';
import {ConfigService, Country} from '../../services/config.service';
import {NotifyService} from '../../services/notify.service';
import {initLeafletPlugins} from './leaflet.helper';
import {PlatformService} from '../../services/platform.service';
import {Router} from '@angular/router';

/// <reference path="../../../../node_modules/@types/leaflet/index.d.ts" />
declare let L;

@Component({
	selector: 'portal-map',
	template: `
		<div class="map_containers" style="height: 475px">
			<div leaflet class="map_leaflet" [leafletOptions]="leaflet_options" (leafletMapReady)="onMapReady($event)"></div>
			<div *ngIf="portals && portals.length===0" class="map_placeholder" style="line-height: 475px">NO DATA</div>
		</div>`
})
export class MapPortalComponent implements AfterViewInit, OnChanges {
	//
	@Input()
	portals: Array<IStatsCountry>;
	@Input()
	formatTooltip: (properties: any) => string;

	private geolayer: L.GeoJSON;
	public leaflet_options = {};
	public current: Country;
	public loading: number = 0;
	public geojson: IApiResultGeoJSON;
	private map: any;

	constructor(private api: ApiService, private platform: PlatformService, private config: ConfigService, private notify: NotifyService, private router: Router) {
		this.current = config.country;
		this.initMap();
	}

	private initMap(): void {
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
					let id = feature.properties['id'];
					if (id === this.current.id) {
						this.router.navigate(['/']);
					} else {
						window.location.href = '/' + (id || '');
					}
				});
			}),
			style: (feature) => {
				return {weight: 1, color: '#fff', fillColor: feature.properties['color'], opacity: 0.9, fillOpacity: 0.55};
			}
		});
		this.leaflet_options = {
			layers: [
				L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'}),
				this.geolayer
			],
			zoom: 3,
			minZoom: 2,
			maxZoom: 10,
			fullscreenControl: true,
			resetControl: false,
			scrollWheelZoom: false,
			center: L.latLng({lat: 56.17002298293205, lng: 9.404296875000002})
		};
	}

	onMapReady(map) {
		this.map = map;
		map.once('focus', () => {
			map.scrollWheelZoom.enable();
		});
	}

	public ngAfterViewInit(): void {
		setTimeout(() => {
			this.load();
		}, 10);
	}


	public ngOnChanges(changes: SimpleChanges): void {
		this.apply();
	}

	private load() {
		this.loading++;
		this.api.getPortalMapData().subscribe(
			(result) => {
				this.display(result);
			},
			error => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
			}
		);
	}

	private display(geojson: IApiResultGeoJSON) {
		this.geojson = geojson;
		setTimeout(() => {
			this.apply();
		}, 0);
	}

	private apply() {
		if (this.platform.isBrowser && this.portals && this.geojson && this.geojson.features) {
			this.geojson.features.forEach(feature => {
				let portal = this.portals.find(p => feature.properties.id == p.id);
				if (portal) {
					feature.properties.name = portal.name;
					feature.properties['value'] = portal.value;
					feature.properties['color'] = portal.id === this.current.id ?
						'#6fd978' :
						'#08306b';
				}
			});
			this.geolayer.clearLayers();
			if (this.geojson.features.length > 0) {
				this.geolayer.addData(this.geojson);
				// this.map.fitBounds(this.geolayer.getBounds());
			}
		}
	}
}
