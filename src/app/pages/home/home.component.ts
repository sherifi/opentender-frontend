import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {IStats, IStatsInYears} from '../../app.interfaces';
import {ConfigService} from '../../services/config.service';
import {NotifyService} from '../../services/notify.service';

@Component({
	moduleId: __filename,
	selector: 'home',
	templateUrl: 'home.template.html'
})
export class HomePage implements OnInit {
	public country: string;
	public loading: number = 0;
	public viz: {
		lots_in_years: IStatsInYears;
	} = {
		lots_in_years: null
	};

	constructor(public router: Router, private api: ApiService, private config: ConfigService, private notify: NotifyService) {
		this.country = config.country.name;
	}

	public ngOnInit(): void {
		this.loading++;
		this.api.getHomeStats().subscribe(
			(result) => {
				this.displayStats(result.data);
			},
			(error) => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
			});
	}

	private displayStats(stats: IStats) {
		if (!stats) {
			this.viz = {lots_in_years: null};
		} else {
			this.viz.lots_in_years = stats.histogram_lots_awardDecisionDate;
		}
	}
}
