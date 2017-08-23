import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {IStats, IStatsLotsInYears} from '../../app.interfaces';
import {ConfigService} from '../../services/config.service';
import {NotifyService} from '../../services/notify.service';

@Component({
	moduleId: __filename,
	selector: 'home',
	templateUrl: 'home.template.html'
})
export class HomePage implements OnInit {
	public country: string;
	private loading: number = 0;
	public viz: {
		lots_in_years: IStatsLotsInYears;
	} = {
		lots_in_years: null
	};

	constructor(public router: Router, private api: ApiService, private config: ConfigService, private notify: NotifyService) {
		this.country = config.country.name;
	}

	public ngOnInit(): void {
		this.loading++;
		this.api.getHomeStats({}).subscribe(
			(result) => {
				this.display(result.data);
			},
			(error) => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
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
