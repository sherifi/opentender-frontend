import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {IStats, IStatsInYears} from '../../app.interfaces';
import {ConfigService} from '../../services/config.service';
import {NotifyService} from '../../services/notify.service';

@Component({
	moduleId: __filename,
	selector: 'home',
	templateUrl: 'home.component.html',
	styleUrls: ['home.component.scss']
})
export class HomePage implements OnInit {
	public country: string;
	public loading: number = 0;
	public viz: {
		lots_in_years: { data: IStatsInYears };
	} = {
		lots_in_years: {data: null}
	};

	constructor(public router: Router, private api: ApiService, private config: ConfigService, private notify: NotifyService) {
		this.country = config.country.id ? config.country.name : 'all Digiwhist data';
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
		let viz = this.viz;
		Object.keys(viz).forEach(key => {
			viz[key].data = null;
		});
		if (!stats) {
			return;
		}
		this.viz.lots_in_years.data = stats.histogram;
	}
}
