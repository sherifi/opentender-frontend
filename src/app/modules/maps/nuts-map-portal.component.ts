import {Component, Input, AfterViewInit, OnChanges, SimpleChanges} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {IApiResultGeoJSON, IStatsCountry} from '../../app.interfaces';
import {ConfigService, Country} from '../../services/config.service';
import {NotifyService} from '../../services/notify.service';
import {PlatformService} from '../../services/platform.service';
import {Router} from '@angular/router';

/// <reference path="../../../../node_modules/@types/leaflet/index.d.ts" />
declare let L;

@Component({
	selector: 'portal-map',
	template: `
		<leafletmap
				[empty]="portals && portals.length===0"
				[loading]="!portals || (loading>0)"
				[height]="476"
				[settings]="leafletSettings"
				[geo]="leafletGeo"
				[formatTooltip]="formatTooltip"
				(regionClick)="onRegionClick($event)"></leafletmap>`
})
export class MapPortalComponent implements AfterViewInit, OnChanges {
	//
	@Input()
	portals: Array<IStatsCountry>;
	@Input()
	formatTooltip: (properties: any) => string;

	public leafletGeo = null;
	public leafletSettings = {
		url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png',
		center: [56.17002298293205, 9.404296875000002],
		noAutoZoom: true
	};

	public current: Country;
	public loading: number = 0;
	public geojson: IApiResultGeoJSON;

	constructor(private api: ApiService, private platform: PlatformService, private config: ConfigService, private notify: NotifyService, private router: Router) {
		this.current = config.country;
		if (!platform.isBrowser) {
			this.loading++; // show "loading..." in server version, maps are not rendered because leaflet doesn't support it
		}
	}

	onRegionClick(feature) {
		let id = feature.properties['id'];
		if (id === this.current.id) {
			this.router.navigate(['/']);
		} else {
			window.location.href = '/' + (id || '');
		}
	}

	public ngAfterViewInit(): void {
		if (this.platform.isBrowser) {
			setTimeout(() => {
				this.load();
			});
		}
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.apply();
	}

	private load() {
		this.loading++;
		let sub = this.api.getPortalMapData().subscribe(
			(result) => {
				this.display(result);
			},
			error => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
				sub.unsubscribe();
			}
		);
	}

	private display(geojson: IApiResultGeoJSON) {
		this.geojson = geojson;
		this.apply();
	}

	private apply() {
		if (this.platform.isBrowser && this.portals && this.geojson && this.geojson.features) {
			this.geojson.features.forEach(feature => {
				let portal = this.portals.find(p => feature.properties.id == p.id);
				if (portal) {
					feature.properties.name = portal.name;
					feature.properties['value'] = portal.value;
					feature.properties['color'] = portal.id === this.current.id ? '#6fd978' : '#08306b';
				}
				feature.properties['border'] = '#fff';
			});
			this.leafletGeo = this.geojson;
		} else {
			this.leafletGeo = null;
		}
	}
}
