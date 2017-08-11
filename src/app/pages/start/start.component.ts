import {Component} from '@angular/core';
import {ConfigService, Country} from '../../services/config.service';

@Component({
	moduleId: __filename,
	selector: 'start',
	templateUrl: 'start.template.html'
})
export class StartPage {
	public ip_country: Country;

	constructor(private config: ConfigService) {
		this.ip_country = config.country.ip;
	}
}
