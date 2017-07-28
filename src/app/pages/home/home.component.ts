import {Component, OnInit} from '@angular/core';
import {CountryService} from '../../services/country.service';
import {Router} from '@angular/router';
import {Consts} from '../../model/consts';
import {ApiService} from '../../services/api.service';
import {IStats, IStatsLotsInYears} from '../../app.interfaces';
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
		{icon: 'icon-library', url: '/dashboards/administrative-capacity-indicators', title: 'Administrative Capacity Indicators', subtitle: 'Indicators', text: Consts.IPSUM}
	];
	public viz: {
		lots_in_years: IStatsLotsInYears;
	} = {
		lots_in_years: null
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
		if (!data) {
			this.viz = {lots_in_years: null};
		} else {
			this.viz.lots_in_years = data.histogram_lots_awardDecisionDate;
		}
	}
}
