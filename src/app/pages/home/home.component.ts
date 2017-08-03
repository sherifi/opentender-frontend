import {Component, OnInit} from '@angular/core';
import {CountryService} from '../../services/country.service';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {IStats, IStatsLotsInYears} from '../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'home',
	templateUrl: 'home.template.html'
})
export class HomePage implements OnInit {
	public country: string;
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
