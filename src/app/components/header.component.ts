import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {CountryService, Country} from '../services/country.service';

@Component({
	moduleId: __filename,
	selector: 'header',
	templateUrl: 'header.template.html'
})
export class HeaderComponent {
	public country: Country;
	public isRootPage = false;

	constructor(public router: Router, private countryService: CountryService) {
		this.country = countryService.get();
		this.isRootPage = this.country.id === null;
	}
}
