import {Injectable, InjectionToken, Inject} from '@angular/core';
import {PlatformService} from './platform.service';
declare var Zone: any;

export interface Country {
	id: string;
	name: string;
	ip?: Country;
}

@Injectable()
export class CountryService {
	private _country: Country;

	constructor(@Inject('COUNTRY') externalCountry, private platform: PlatformService) {
		// console.log('testz', externalCountry);
		let country = externalCountry; // Zone.current.get('country');
		if (!country && this.platform.isBrowser) {
			country = document['country'];
		}
		if (country) {
			this._country = country;
		} else {
			this._country = {id: null, name: 'General'};
			console.log('No country found');
		}
	}

	get() {
		return this._country;
	}

}
