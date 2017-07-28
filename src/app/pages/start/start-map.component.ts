import {Component} from '@angular/core';
import {PortalsService} from '../../services/portals.service';
import {ApiService} from '../../services/api.service';
import {CountryService} from '../../services/country.service';
import {ICountryStats} from '../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'start-map',
	templateUrl: 'start-map.template.html'
})
export class StartMapComponent {
	portals = [];
	allportal = {};

	constructor(private api: ApiService, private portalService: PortalsService, private countryService: CountryService) {
		this.api.getPortalsStats().subscribe(
			(result) => this.display(result.data),
			(error) => console.error(error),
			() => {
				// console.log('getPortalsStats complete');
			});
	}

	display(data: ICountryStats): void {
		if (!data) {
			return;
		}
		let currentCountry = this.countryService.get();
		let count_all = 0;
		let ps = this.portalService.get();
		ps.forEach((p) => {
			if (p.id !== 'eu') {
				count_all += data[p.id] || 0;
			}
		});
		data['eu'] = count_all;
		this.portals = [];
		ps.forEach(p => {
			let portal = {
				id: p.id,
				name: p.name,
				count: data[p.id] || 0,
				current: currentCountry.id === p.id
			};
			if (p.id !== 'eu') {
				this.portals.push(portal);
			} else {
				this.allportal = portal;
			}
		});
	}
}
