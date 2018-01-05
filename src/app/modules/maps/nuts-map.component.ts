import {AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {IApiResultGeoJSON, ISeriesProvider, IStatsNuts} from '../../app.interfaces';
import {PlatformService} from '../../services/platform.service';
import {ApiService} from '../../services/api.service';
import * as d3chroma from 'd3-scale-chromatic/build/d3-scale-chromatic';
import {scaleLinear} from 'd3-scale';
import {NotifyService} from '../../services/notify.service';
import {Utils} from '../../model/utils';

@Component({
	selector: 'graph[nutsmap]',
	template: `
		<leafletmap
				[empty]="data_list.length===0"
				[height]="376"
				[settings]="leafletSettings"
				[formatTooltip]="formatTooltip"
				[geo]="leafletGeo"
				(regionClick)="onRegionClick($event)"></leafletmap>
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
		<div class="nutsmap_subtitle"><a [routerLink]="['/about/how-opentender-works']" pageScroll="#info-maps" i18n>Sources</a></div>
		<series-download-button *ngIf="!hideLegend && data_list.length>0" [sender]="this"></series-download-button>`,
	styleUrls: ['nuts-map.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class NUTSMapComponent implements OnChanges, ISeriesProvider {
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

	public data_list = [];
	public leafletGeo;
	public leafletSettings = {
		url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
		center: [52.520645, 13.409779]
	};

	constructor(private api: ApiService, private platform: PlatformService, private router: Router, private notify: NotifyService) {
	}

	getSeriesInfo() {
		return {data: this.data_list, header: {id: 'NUTS' + this.level, value: 'Amount', name: 'Name'}, filename: this.title};
	}

	onRegionClick(feature) {
		this.router.navigate(['/region/' + feature.properties['id']]);
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
						color: d3chroma.interpolateBlues(scale(nut.value)),
						border: '#a4a4a4'
					},
					type: nut.feature.type,
					geometry: nut.feature.geometry
				};
				return feature;
			})
		};
		this.leafletGeo = newgeo;
	}

	loadMap() {
		this.loading++;
		let sub = this.api.getNutsMap(this.level).subscribe(
			(result) => {
				this.displayNuts(result);
			},
			(error) => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
				sub.unsubscribe();
			});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (this.platform.isBrowser && this.data) {
			this.loadMap();
		}
	}

}
