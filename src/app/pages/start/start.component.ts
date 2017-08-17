import {Component} from '@angular/core';
import {ConfigService, Country} from '../../services/config.service';
import {ApiService} from '../../services/api.service';
import {ICountryStats} from '../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'start',
	templateUrl: 'start.template.html'
})
export class StartPage {
	public ip_country: Country;
	private portals: Array<ICountryStats> = [];
	private allportal: ICountryStats;
	private current: Country;

	constructor(private api: ApiService, private config: ConfigService) {
		this.ip_country = config.country.ip;
		this.current = this.config.country;
		this.api.getPortalsStats().subscribe(
			(result) => this.display(result.data),
			(error) => console.error(error),
			() => {
				// console.log('getPortalsStats complete');
			});
	}

	display(data: Array<ICountryStats>): void {
		if (!data) {
			return;
		}
		this.portals = [];
		data.forEach(p => {
			if (p.id !== 'eu') {
				this.portals.push(p);
			} else {
				this.allportal = p;
			}
		});
	}

}
