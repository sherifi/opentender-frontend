import {Component} from '@angular/core';
import {ConfigService, Country} from '../../services/config.service';
import {ApiService} from '../../services/api.service';
import {IStatsCountry} from '../../app.interfaces';
import {NotifyService} from '../../services/notify.service';
import {PlatformService} from '../../services/platform.service';

@Component({
	moduleId: __filename,
	selector: 'start',
	templateUrl: 'start.component.html',
	styleUrls: ['start.component.scss']
})
export class StartPage {
	public ip_country: Country;
	public portals: Array<IStatsCountry> = [];
	private allportal: IStatsCountry;
	private current: Country;
	private loading: number = 0;

	constructor(private api: ApiService, private config: ConfigService, private notify: NotifyService, private platform: PlatformService) {
		this.current = this.config.country;
		if (platform.isBrowser) {
			this.loading++;
			let sub_ping = this.api.ping().subscribe(
				(result) => {
					this.ip_country = (result && result.data && result.data.country) ? result.data.country : null;
				},
				(error) => {
					this.notify.error(error);
				},
				() => {
					this.loading--;
					sub_ping.unsubscribe();
				});
		}
		this.loading++;
		let sub = this.api.getPortalsStats().subscribe(
			(result) => {
				this.display(result.data);
			},
			(error) => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
				sub.unsubscribe();
			});
	}

	display(data: Array<IStatsCountry>): void {
		if (!data) {
			return;
		}
		this.portals = [];
		data.forEach(p => {
			if (p.id !== 'all') {
				this.portals.push(p);
			} else {
				this.allportal = p;
			}
		});
	}

}
