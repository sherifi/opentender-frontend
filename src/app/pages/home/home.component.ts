import {Component, OnInit} from '@angular/core';
import {CountryService} from '../../services/country.service';
import {Router} from '@angular/router';
import {Consts} from '../../model/consts';
import {ApiService} from '../../services/api.service';
import {IStats} from '../../app.interfaces';
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
		{icon: 'icon-search', url: '/search', title: 'Search', subtitle: 'Search and Find', text: Consts.IPSUM},
		{icon: 'icon-briefcase', url: '/dashboards/market-analysis', title: 'Market Analysis', subtitle: 'Data overview', text: Consts.IPSUM},
		{icon: 'icon-database', url: '/downloads', title: 'Download', subtitle: 'Download data', text: Consts.IPSUM},
		{icon: 'icon-checkmark', url: '/dashboards/transparency-indicators', title: 'Transparency Indicators', subtitle: 'Indicators', text: Consts.IPSUM},
		{icon: 'icon-flag', url: '/dashboards/corruption-indicators', title: 'Corruption Risk Indicators', subtitle: 'Indicators', text: Consts.IPSUM},
		{icon: 'icon-library', url: '/dashboards/administrative-quality', title: 'Administrative quality', subtitle: 'Indicators', text: Consts.IPSUM}
	];
	private charts: {
		lots_in_years: IChartBar;
	} = {
		lots_in_years: {
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
			data: null
		},
	};


	constructor(public router: Router, private api: ApiService, private countryService: CountryService) {
		this.country = countryService.get().name;
	}

	public ngOnInit(): void {
		this.api.getHomeStats({}).subscribe(
			(result) => this.display(result.data),
			(error) => {
				console.error(error);
			},
			() => {
				// console.log('getViz tender_per_year complete');
			});
	}

	private display(data: IStats) {
		this.charts.lots_in_years.data = null;
		if (data.histogram_lots_awardDecisionDate) {
			this.charts.lots_in_years.data = Object.keys(data.histogram_lots_awardDecisionDate).map((key) => {
				return {name: key, value: data.histogram_lots_awardDecisionDate[key]};
			});
		}
	}
}
