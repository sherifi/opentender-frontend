import {Component} from '@angular/core';
import {ConfigService} from '../services/config.service';
import {CountryService} from '../services/country.service';
import {Router} from '@angular/router';

@Component({
	moduleId: __filename,
	selector: 'footer',
	templateUrl: 'footer.template.html'
})
export class FooterComponent {
	public country: string;
	public version: string;

	constructor(public router: Router, private config: ConfigService, private countryService: CountryService) {
		this.country = countryService.get().name;
		this.version = config.get('version');
	}

}
