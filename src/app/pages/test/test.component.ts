import {Component} from '@angular/core';
import {IChartPie, IChartTreeMap} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {Consts} from '../../model/consts';
import {PlatformService} from '../../services/platform.service';
import {Utils} from '../../model/utils';
import {ApiService} from '../../services/api.service';
import * as d3chroma from 'd3-scale-chromatic/build/d3-scale-chromatic';
import * as d3 from 'd3';

@Component({
	moduleId: __filename,
	selector: 'test',
	templateUrl: 'test.template.html'
})
export class TestPage {
	private map: any;
	private geolayer: any = {};
	private leaflet_options = {};
	private level = 1;
	private companies = false;

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
					layer.bindPopup(JSON.stringify(feature.properties));
				}),
				style: (feature) => {
					return {weight: 1, color: '#a4a4a4', fillColor: feature.properties['color'], opacity: 0.9, fillOpacity: 0.55};
				}
			});
		this.leaflet_options = {
			layers: [
				L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'}),
				this.geolayer
			],
			zoom: 3,
			center: L.latLng({lat: 52.520645, lng: 13.409779})
		};
		this.loadMap(this.level);
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

	displayNuts(res, geo, level) {
		let nuts = {};
		let max = 0;
		Object.keys(res.data).forEach(key => {
			let nutskey = this.validateNutsCode(key, level);
			nuts[nutskey] = (nuts[nutskey] || 0) + res.data[key];
			max = Math.max(max, nuts[nutskey]);
		});
		let scale = d3.scaleLinear().domain([0, max]).range([0, 1]);
		geo.features = geo.features.filter(feature => {
			let value = nuts[feature.properties.id];
			if (value > 0) {
				delete nuts[feature.properties.id];
				feature.properties['value'] = value;
				feature.properties['color'] = d3chroma.interpolateBlues(scale(value));
				return true;
			}
			return false;
		});
		if (Object.keys(nuts).length > 0) {
			console.log('unused', nuts);
		}
		if (geo.features.length > 0) {
			this.geolayer.clearLayers();
			this.geolayer.addData(geo);
			this.map.fitBounds(this.geolayer.getBounds());
		}
	}

	toggle() {
		this.companies = !this.companies;
		this.loadMap(this.level);
	}

	loadMap(level) {
		if (!this.platform.isBrowser) {
			return;
		}
		this.api.getNutsMap(level).subscribe(
			result => {
				if (this.companies) {
					this.api.getCompanyNutsStats().subscribe(
						res => {
							this.displayNuts(res, result, level);
						},
						err => {
							console.error(err);
						},
						() => {
							// console.log('nuts complete');
						}
					);
				} else {
					this.api.getAuthorityNutsStats().subscribe(
						res => {
							this.displayNuts(res, result, level);
						},
						err => {
							console.error(err);
						},
						() => {
							// console.log('nuts complete');
						}
					);
				}
			},
			error => {
				console.error(error);
			},
			() => {
				// console.log('nuts map complete');
			});
	}

	setLevel(level) {
		this.level = level;
		this.loadMap(level);
	}

	onMapReady(map) {
		this.map = map;
	}

	ngOnInit(): void {
	}
}
