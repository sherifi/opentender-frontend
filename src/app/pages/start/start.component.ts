import {Component} from '@angular/core';
import {CountryService, Country} from '../../services/country.service';

@Component({
	moduleId: __filename,
	selector: 'start',
	templateUrl: 'start.template.html'
})
export class StartPage {
	public ip_country: Country;

	constructor(private countryService: CountryService) {
		this.ip_country = countryService.get().ip;
	}
}
