import {Component} from '@angular/core';
import {IChartPie} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {Consts} from '../../model/consts';
import {PlatformService} from '../../services/platform.service';

@Component({
	moduleId: __filename,
	selector: 'test',
	templateUrl: 'test.template.html'
})
export class TestPage {

	chartwidth = 40;

	private charts: {
		cpvs_codes: IChartPie;
	} = {
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
			data: [{"name": "Medical equipments", "value": 119}, {"name": "Pharmaceutical products", "value": 181}, {"name": "Firefighting vehicles", "value": 320}, {
				"name": "Fire engines",
				"value": 273
			}, {"name": "Laboratory, optical and precision equipments (excl. glasses)", "value": 151}, {"name": "Mass spectrometer", "value": 122}, {
				"name": "Software package and information systems",
				"value": 104
			}, {"name": "Special-purpose road passenger-transport services", "value": 112}, {"name": "IT services: consulting, software development, Internet and support", "value": 295}, {"name": "Electricity", "value": 101}]
		}
	};


	constructor(private platform: PlatformService) {
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

	onSliderChange(event): void {
		this.chartwidth = event.endValue;
		this.triggerResize();
	}
}
