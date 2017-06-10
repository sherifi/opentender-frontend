import {Injectable, InjectionToken, Inject} from '@angular/core';
import {PlatformService} from './platform.service';
import {PortalsService} from './portals.service';
declare var Zone: any;

export interface Country {
	id: string;
	name: string;
	ip?: Country;
	foi?: any;
}

@Injectable()
export class CountryService {
	private _country: Country;

	constructor(@Inject('COUNTRY') externalCountry, private platform: PlatformService, portalservice: PortalsService) {
		let country = externalCountry;
		if (!country && this.platform.isBrowser) {
			country = document['country'];
		}
		if (country) {
			this._country = country;
		} else {
			this._country = {id: null, name: 'General'};
			console.log('No country found');
		}
		let portals = portalservice.get();
		portals.forEach(portal => {
			if (portal.id == this._country.id) {
				this._country.foi = portal.foi;
			}
		});
	}

	get() {
		return this._country;
	}

}
