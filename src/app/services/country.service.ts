import {Injectable, Inject} from '@angular/core';
import {PlatformService} from './platform.service';

export interface Country {
	id: string;
	name: string;
	ip?: Country;
	foi?: any;
}

@Injectable()
export class CountryService {
	private _country: Country;

	constructor(@Inject('COUNTRY') externalCountry, private platform: PlatformService) {
		let country = externalCountry;
		if (!country && this.platform.isBrowser) {
			country = document['country'];
		}
		if (country) {
			this._country = country;
		} else {
			this._country = {id: null, name: 'General', foi: null};
			console.log('No country found');
		}
	}

	get() {
		return this._country;
	}

}
