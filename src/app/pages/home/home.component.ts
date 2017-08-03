import {Component, OnInit} from '@angular/core';
import {CountryService} from '../../services/country.service';
import {Router} from '@angular/router';
import {Consts} from '../../model/consts';
import {ApiService} from '../../services/api.service';
import {IStats, IStatsLotsInYears} from '../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'home',
	templateUrl: 'home.template.html'
})
export class HomePage implements OnInit {
	public country: string;
	public cards = [
		{icon: 'icon-search', url: '/search', title: 'Search', subtitle: 'Search and Find', text: Consts.IPSUM},
		{icon: 'icon-briefcase', url: '/dashboards/market-analysis', title: 'Market Analysis', subtitle: 'Data overview', text: 'This dashboard provides overview of public procurement markets, helping buyers and bidders to tender more effectively.'},
		{icon: 'icon-database', url: '/downloads', title: 'Download', subtitle: 'Download data', text: Consts.IPSUM},
		{icon: 'icon-checkmark', url: '/dashboards/transparency-indicators', title: 'Transparency', subtitle: 'Indicators', text: 'This dashboard allows you to analyse and benchmark the degree of transparency in public procurement tenders.'},
		{icon: 'icon-flag', url: '/dashboards/corruption-indicators', title: 'Corruption Risk', subtitle: 'Indicators', text: 'This dashboard allows you to analyse and benchmark public procurement integrity risks.'},
		{icon: 'icon-library', url: '/dashboards/administrative-capacity-indicators', title: 'Administrative Capacity', subtitle: 'Indicators', text: 'This dashboard allows you to analyse and benchmark buyers\' administrative capacity.'}
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
