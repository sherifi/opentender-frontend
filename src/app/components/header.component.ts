import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ConfigService, Country} from '../services/config.service';

@Component({
	moduleId: __filename,
	selector: 'header',
	templateUrl: 'header.template.html'
})
export class HeaderComponent {
	public country: Country;
	public isRootPage = false;

	constructor(public router: Router, private config: ConfigService) {
		this.country = config.country;
		this.isRootPage = this.country.id === null;
	}

	public isActive(section: string, routerurl: string) {
		return (routerurl || '').indexOf(section) >= 0;
	}

	public isActiveHome(routerurl: string) {
		return (routerurl === '/');
	}

	public isActiveStart(routerurl: string) {
		return (routerurl === '/start');
	}

}
