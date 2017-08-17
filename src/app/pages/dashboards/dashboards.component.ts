import {Component, OnInit} from '@angular/core';
import {I18NService} from '../../services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'explore',
	templateUrl: 'dashboards.template.html'
})
export class DashboardsPage implements OnInit {
	public cards = [];

	constructor(i18n: I18NService) {
		this.cards = [
			{icon: 'icon-flag', url: '/dashboards/corruption-indicators', title: i18n.get('Corruption Risk')},
			{icon: 'icon-library', url: '/dashboards/administrative-capacity-indicators', title: i18n.get('Administrative Capacity')},
			{icon: 'icon-checkmark', url: '/dashboards/transparency-indicators', title: i18n.get('Transparency')},
			{icon: 'icon-hammer', url: '/dashboards/market-analysis', title: i18n.get('Market Analysis')}
		];
	}

	ngOnInit(): void {
	}
}
