import {Component} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Country, CountryService} from '../../services/country.service';
import {ICountryStats} from '../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'start-map',
	templateUrl: 'start-map.template.html'
})
export class StartMapComponent {
	portals: Array<ICountryStats> = [];
	allportal: ICountryStats;
	current: Country;

	constructor(private api: ApiService, private countryService: CountryService) {
		this.current = this.countryService.get();
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
