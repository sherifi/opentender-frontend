import {Component} from '@angular/core';
import {CountryService} from '../../services/country.service';
import {Router} from '@angular/router';
import {Consts} from '../../model/consts';

@Component({
	moduleId: __filename,
	selector: 'home',
	templateUrl: 'home.template.html'
})
export class HomePage {
	public country: string;
	public cards = [
		{icon: 'icon-search', url: '/search', title: 'Search', subtitle: 'Search and Find', text: Consts.IPSUM},
		{icon: 'icon-briefcase', url: '/explore/rankings', title: 'Rankings', subtitle: 'Top/Bottom performers', text: Consts.IPSUM},
		{icon: 'icon-database', url: '/downloads', title: 'Download', subtitle: 'Download data', text: Consts.IPSUM},
		{icon: 'icon-flag', url: '/explore/corruption-indicators', title: 'Corruption Risk Indicators', subtitle: 'Indicators', text: Consts.IPSUM},
		{icon: 'icon-checkmark', url: '/explore/transparency-indicators', title: 'Transparency Indicators', subtitle: 'Indicators', text: Consts.IPSUM},
		{icon: 'icon-library', url: '/explore/administrative-quality', title: 'Administrative quality', subtitle: 'Indicators', text: Consts.IPSUM},
		{icon: 'icon-books', url: '/about', title: 'About', subtitle: 'Find out about this site', text: Consts.IPSUM},
		{icon: 'icon-office', url: '/documentation/how-opentender-works', title: 'How to use this site', subtitle: 'Documentation', text: Consts.IPSUM},
		{icon: 'icon-office', url: '/documentation/methodology', title: 'Methodology', subtitle: 'Documentation', text: Consts.IPSUM},
	];

	constructor(public router: Router, private countryService: CountryService) {
		this.country = countryService.get().name;
	}
}
