import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {IStats, IStatsInYears} from '../../app.interfaces';
import {ConfigService, Country} from '../../services/config.service';
import {NotifyService} from '../../services/notify.service';
import {I18NService} from '../../modules/i18n/services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'home',
	templateUrl: 'home.component.html',
	styleUrls: ['home.component.scss']
})
export class HomePage implements OnInit {
	public countryname: string;
	public country: Country;
	public loading: number = 0;
	public viz: {
		lots_in_years: { data: IStatsInYears };
	} = {
		lots_in_years: {data: null}
	};

	constructor(public router: Router, private api: ApiService, private config: ConfigService, private notify: NotifyService, i18n: I18NService) {
		this.country = config.country;
		this.countryname = config.country.id ? config.country.name : i18n.get('All Digiwhist data');
	}

	public ngOnInit(): void {
		this.loading++;
		let sub = this.api.getHomeStats().subscribe(
			(result) => {
				this.displayStats(result.data);
			},
			(error) => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
				sub.unsubscribe();
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
