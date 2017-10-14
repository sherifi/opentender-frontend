import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {IApiGeoJSONResult, ISeriesProvider, IStatsNuts} from '../../app.interfaces';
import {PlatformService} from '../../services/platform.service';
import {ApiService} from '../../services/api.service';
import * as d3chroma from 'd3-scale-chromatic/build/d3-scale-chromatic';
import {scaleLinear} from 'd3-scale';
import {NotifyService} from '../../services/notify.service';
import {Utils} from '../../model/utils';

/// <reference path="../../../../node_modules/@types/leaflet/index.d.ts" />
declare let L;

@Component({
	selector: 'graph[nutsmap]',
	template: `
		<div class="nutsmap_containers" style="height: 376px">
			<div leaflet class="nutsmap_leaflet" [leafletOptions]="leaflet_options" (leafletMapReady)="onMapReady($event)"></div>
			<div *ngIf="valid===0" class="nutsmap_placeholder" style="line-height: 376px">NO DATA</div>
		</div>
		<div class="nutsmap_legend">
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
		<div class="nutsmap_subtitle">Administrative boundaries: © GISCO - Eurostat © EuroGeographics © UN-FAO © Turkstat</div>
		<select-series-download-button [sender]="this"></select-series-download-button>`
})
export class GraphNutsMapComponent implements OnChanges, ISeriesProvider {
	@Input()
	data: IStatsNuts;
	@Input()
	level: number = 1;
	@Input()
	formatTooltip: any;
	@Input()
	title: string;

	private colorLow: string = '';
	private valueLow: number;
	private colorHigh: string = '';
	private valueHigh: number;

	private loading: number = 0;
	private invalid: number = 0;
	private valid: number = 0;
	private map: any;
	private geolayer: L.GeoJSON;
	private leaflet_options = {};
	private data_list = [];

	constructor(private api: ApiService, private platform: PlatformService, private router: Router, private notify: NotifyService) {
		this.initMap();
	}

	initMap() {
		if (!this.platform.isBrowser) {
			return;
		}

		// source: https://github.com/Leaflet/Leaflet.fullscreen
		// included here since webpack treeshaking is removing the import as unused
		if (!L.Control.Fullscreen) {
			L.Control.Fullscreen = L.Control.extend({
				options: {
					position: 'topleft',
					title: {
						'false': 'View Fullscreen',
						'true': 'Exit Fullscreen'
					}
				},

				onAdd: function(map) {
					let container = L.DomUtil.create('div', 'leaflet-control-fullscreen leaflet-bar leaflet-control');

					this.link = L.DomUtil.create('a', 'leaflet-control-fullscreen-button leaflet-bar-part', container);
					this.link.href = '#';

					this._map = map;
					this._map.on('fullscreenchange', this._toggleTitle, this);
					this._toggleTitle();

					L.DomEvent.on(this.link, 'click', this._click, this);

					return container;
				},

				_click: function(e) {
					L.DomEvent.stopPropagation(e);
					L.DomEvent.preventDefault(e);
					this._map.toggleFullscreen(this.options);
				},

				_toggleTitle: function() {
					this.link.title = this.options.title[this._map.isFullscreen()];
				}
			});

			L.Map.include({
				isFullscreen: function() {
					return this._isFullscreen || false;
				},

				toggleFullscreen: function(options) {
					let container = this.getContainer();
					if (this.isFullscreen()) {
						if (options && options.pseudoFullscreen) {
							this._disablePseudoFullscreen(container);
						} else if (document.exitFullscreen) {
							document.exitFullscreen();
						} else if (document['mozCancelFullScreen']) {
							document['mozCancelFullScreen']();
						} else if (document.webkitCancelFullScreen) {
							document.webkitCancelFullScreen();
						} else if (document['msExitFullscreen']) {
							document['msExitFullscreen']();
						} else {
							this._disablePseudoFullscreen(container);
						}
					} else {
						if (options && options.pseudoFullscreen) {
							this._enablePseudoFullscreen(container);
						} else if (container.requestFullscreen) {
							container.requestFullscreen();
						} else if (container.mozRequestFullScreen) {
							container.mozRequestFullScreen();
						} else if (container.webkitRequestFullscreen) {
							container.webkitRequestFullscreen(Element['ALLOW_KEYBOARD_INPUT']);
						} else if (container.msRequestFullscreen) {
							container.msRequestFullscreen();
						} else {
							this._enablePseudoFullscreen(container);
						}
					}

				},

				_enablePseudoFullscreen: function(container) {
					L.DomUtil.addClass(container, 'leaflet-pseudo-fullscreen');
					this._setFullscreen(true);
					this.fire('fullscreenchange');
				},

				_disablePseudoFullscreen: function(container) {
					L.DomUtil.removeClass(container, 'leaflet-pseudo-fullscreen');
					this._setFullscreen(false);
					this.fire('fullscreenchange');
				},

				_setFullscreen: function(fullscreen) {
					this._isFullscreen = fullscreen;
					let container = this.getContainer();
					if (fullscreen) {
						L.DomUtil.addClass(container, 'leaflet-fullscreen-on');
					} else {
						L.DomUtil.removeClass(container, 'leaflet-fullscreen-on');
					}
					this.invalidateSize();
				},

				_onFullscreenChange: function(e) {
					let fullscreenElement =
						document.fullscreenElement ||
						document['mozFullScreenElement'] ||
						document.webkitFullscreenElement ||
						document['msFullscreenElement'];

					if (fullscreenElement === this.getContainer() && !this._isFullscreen) {
						this._setFullscreen(true);
						this.fire('fullscreenchange');
					} else if (fullscreenElement !== this.getContainer() && this._isFullscreen) {
						this._setFullscreen(false);
						this.fire('fullscreenchange');
					}
				}
			});

			L.Map.mergeOptions({
				fullscreenControl: false
			});

			L.Map.addInitHook(function() {
				if (this.options.fullscreenControl) {
					this.fullscreenControl = new L.Control.Fullscreen(this.options.fullscreenControl);
					this.addControl(this.fullscreenControl);
				}

				let fullscreenchange;

				if ('onfullscreenchange' in document) {
					fullscreenchange = 'fullscreenchange';
				} else if ('onmozfullscreenchange' in document) {
					fullscreenchange = 'mozfullscreenchange';
				} else if ('onwebkitfullscreenchange' in document) {
					fullscreenchange = 'webkitfullscreenchange';
				} else if ('onmsfullscreenchange' in document) {
					fullscreenchange = 'MSFullscreenChange';
				}

				if (fullscreenchange) {
					let onFullscreenChange = L.bind(this._onFullscreenChange, this);

					this.whenReady(function() {
						L.DomEvent.on(document, fullscreenchange, onFullscreenChange);
					});

					this.on('unload', function() {
						L.DomEvent.off(document, fullscreenchange, onFullscreenChange);
					});
				}
			});

			L.control.fullscreen = function(options) {
				return new L.Control.Fullscreen(options);
			};
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
			fullscreenControl: true,
			center: L.latLng({lat: 52.520645, lng: 13.409779})
		};
	}

	getSeriesInfo() {
		return {data: this.data_list, header: {id: 'NUTS' + this.level, value: 'Amount', name: 'Name'}, filename: this.title};
	}

	displayNuts(geo: IApiGeoJSONResult) {
		let nuts = {};
		let max = 0;
		let min = null;
		Object.keys(this.data).forEach(key => {
			let nutskey = Utils.validateNutsCode(key, this.level);
			nuts[nutskey] = (nuts[nutskey] || 0) + this.data[key];
			let val = nuts[nutskey];
			if (nutskey !== 'invalid') {
				max = Math.max(max, val);
				if (min !== null) {
					min = Math.min(min, val);
				} else {
					min = val;
				}
			}
		});
		let scale = scaleLinear().domain([0, max]).range([0, 1]);
		this.colorLow = d3chroma.interpolateBlues(scale(min));
		this.valueLow = min;
		this.colorHigh = d3chroma.interpolateBlues(scale(max));
		this.valueHigh = max;
		this.data_list = [];
		this.valid = 0;
		geo.features = geo.features.filter(feature => {
			let value = nuts[feature.properties.id];
			if (value > 0) {
				delete nuts[feature.properties.id];
				feature.properties['value'] = value;
				feature.properties['color'] = d3chroma.interpolateBlues(scale(value));
				this.valid += value;
				this.data_list.push({id: feature.properties.id, name: feature.properties.name, value: value});
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
