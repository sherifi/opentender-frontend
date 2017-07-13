import {Component} from '@angular/core';
import {IChartPie, IChartTreeMap} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {Consts} from '../../model/consts';
import {PlatformService} from '../../services/platform.service';
import {Utils} from '../../model/utils';
import {ApiService} from '../../services/api.service';
import PathOptions = L.PathOptions;

@Component({
	moduleId: __filename,
	selector: 'test',
	templateUrl: 'test.template.html'
})
export class TestPage {

	chartwidth = 68;

	private charts: {
		cpvs_code_main: IChartTreeMap;
		cpvs_codes: IChartPie;
	} = {
		cpvs_code_main: {
			visible: true,
			chart: {
				schemeType: 'ordinal',
				view: {
					def: {width: 680, height: 400},
					min: {height: 400},
					max: {height: 400}
				},
				colorScheme: {
					'domain': Consts.colors.diverging
				},
				valueFormatting: Utils.formatValue
			},
			select: (event) => {
				// this.router.navigate(['/sector/' + event.id]);
			},
			data: [{'name': 'Construction work', 'value': 1e6, 'id': '45'}, {
				'name': 'Architectural, construction, engineering and inspection services',
				'value': 19143,
				'id': '71'
			}, {'name': 'Sewage, refuse, cleaning and environmental services', 'value': 13532, 'id': '90'}, {
				'name': 'Transport equipment and auxiliary products to transportation',
				'value': 13464,
				'id': '34'
			}, {'name': 'Business services: law, marketing, consulting, recruitment, printing and security', 'value': 6298, 'id': '79'}, {
				'name': 'Medical equipments, pharmaceuticals and personal care products',
				'value': 5690,
				'id': '33'
			}, {'name': 'Petroleum products, fuel, electricity and other sources of energy', 'value': 5130, 'id': '09'}, {
				'name': 'IT services: consulting, software development, Internet and support',
				'value': 5072,
				'id': '72'
			}, {'name': 'Office and computing machinery, equipment and supplies except furniture and software packages', 'value': 4939, 'id': '30'}, {
				'name': 'Laboratory, optical and precision equipments (excl. glasses)',
				'value': 4118,
				'id': '38'
			}]
		},
		cpvs_codes: {
			visible: false,
			chart: {
				schemeType: 'ordinal',
				view: {
					def: {width: 400, height: 320},
					min: {height: 320},
					max: {height: 320}
				},
				labels: true,
				valueFormatting: Utils.formatPercent,
				explodeSlices: false,
				doughnut: false,
				gradient: false,
				colorScheme: {
					domain: Consts.colors.diverging
				}
			},
			select: (event) => {
			},
			onLegendLabelClick: (event) => {
			},
			data: [{'name': 'Medical equipments', 'value': 119}, {'name': 'Pharmaceutical products', 'value': 181}, {'name': 'Firefighting vehicles', 'value': 320}, {
				'name': 'Fire engines',
				'value': 273
			}, {'name': 'Laboratory, optical and precision equipments (excl. glasses)', 'value': 151}, {'name': 'Mass spectrometer', 'value': 122}, {
				'name': 'Software package and information systems',
				'value': 104
			}, {'name': 'Special-purpose road passenger-transport services', 'value': 112}, {'name': 'IT services: consulting, software development, Internet and support', 'value': 295}, {'name': 'Electricity', 'value': 101}]
		}
	};

	private geolayer: any = {};
	private leaflet_options = {};

	constructor(private api: ApiService, private platform: PlatformService) {
		this.loadMap();
	}

	loadMap() {
		if (!this.platform.isBrowser) {
			return;
		}
		this.geolayer =
			L.geoJSON(null, {
				style: (feature) => {
					return {weight: 1, color: '#000', fillColor: '#ff7800', opacity: 0.5};
				}
			});
		this.leaflet_options = {
			layers: [
				L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'}),
				this.geolayer
			],
			zoom: 3,
			center: L.latLng({lat: 52.520645, lng: 13.409779})
		};

		this.api.getNutsMap().subscribe(
			result => {
				this.geolayer.addData(result);
			},
			error => {
				console.error(error);
			},
			() => {
				// console.log('nuts map complete');
			});
	}

	onMapReady(map) {
		// Do stuff with map

	}

	ngOnInit(): void {
		this.triggerResize();
	}

	ngAfterViewInit(): void {
		// this.triggerResize();
	}

	triggerResize(): void {
		if (this.platform.isBrowser) {
			setTimeout(() => {
				let evt = window.document.createEvent('UIEvents');
				evt.initUIEvent('resize', true, false, window, 0);
				window.dispatchEvent(evt);
			}, 0);
		}
	}

	onTestSliderChange(event): void {
		console.log('test slider', event);
	}

	onSliderChange(event): void {
		this.chartwidth = event.endValue;
		this.triggerResize();
	}
}
