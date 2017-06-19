import {Component, OnInit} from '@angular/core';
import {CountryService} from '../../services/country.service';
import {Router} from '@angular/router';
import {Consts} from '../../model/consts';
import {ApiService} from '../../services/api.service';
import {IVizData} from '../../app.interfaces';
import {IChartBar} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {Utils} from '../../model/utils';

@Component({
	moduleId: __filename,
	selector: 'home',
	templateUrl: 'home.template.html'
})
export class HomePage implements OnInit {
	public country: string;
	public cards = [
		{icon: 'icon-briefcase', url: '/dashboards', title: 'Dashboards', subtitle: 'Data overview', text: Consts.IPSUM},
		{icon: 'icon-search', url: '/search', title: 'Search', subtitle: 'Search and Find', text: Consts.IPSUM},
		{icon: 'icon-database', url: '/downloads', title: 'Download', subtitle: 'Download data', text: Consts.IPSUM},
		{icon: 'icon-checkmark', url: '/dashboards/transparency-indicators', title: 'Transparency Indicators', subtitle: 'Indicators', text: Consts.IPSUM},
		{icon: 'icon-flag', url: '/dashboards/corruption-indicators', title: 'Corruption Risk Indicators', subtitle: 'Indicators', text: Consts.IPSUM},
		{icon: 'icon-library', url: '/dashboards/administrative-quality', title: 'Administrative quality', subtitle: 'Indicators', text: Consts.IPSUM}
	];
	private charts: {
		lots_in_years: IChartBar;
	} = {
		lots_in_years: {
			visible: false,
			chart: {
				schemeType: 'ordinal',
				view: {
					def: {width: 1024, height: 320},
					min: {height: 320},
					max: {height: 320}
				},
				xAxis: {
					show: true,
					showLabel: true,
					label: 'Years',
					defaultHeight: 20,
					tickFormatting: Utils.formatYear
				},
				yAxis: {
					show: true,
					showLabel: true,
					label: 'Number of Tender Lots',
					defaultWidth: 30,
					minInterval: 1,
					tickFormatting: Utils.formatValue
				},
				showGridLines: true,
				gradient: false,
				colorScheme: {
					domain: Consts.colors.single
				}
			},
			select: (event) => {
			},
			onLegendLabelClick: (event) => {
			},
			data: []
		},
	};


	constructor(public router: Router, private api: ApiService, private countryService: CountryService) {
		this.country = countryService.get().name;
	}

	public ngOnInit(): void {
		this.api.getViz(['tender_lots_per_year']).subscribe(
			(result) => this.display(result.data),
			(error) => {
				console.error(error);
			},
			() => {
				// console.log('getViz tender_per_year complete');
			});
	}

	private display(data: IVizData) {
		this.charts.lots_in_years.data = [];
		if (data.tender_lots_per_year && data.tender_lots_per_year.lots_in_years) {
			this.charts.lots_in_years.data = Object.keys(data.tender_lots_per_year.lots_in_years).map((key) => {
				return {name: key, value: data.tender_lots_per_year.lots_in_years[key]};
			});
		}
		this.charts.lots_in_years.visible = this.charts.lots_in_years.data.length > 0;
	}
}
