import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {Consts} from '../../model/consts';

@Component({
	moduleId: __filename,
	selector: 'explore',
	templateUrl: 'dashboards.template.html'
})
export class DashboardsPage implements OnInit {
	public isRootPage = false;
	public cards = [
		{icon: 'icon-flag', url: '/dashboards/corruption-indicators', title: 'Corruption Risk', subtitle: 'Explore Corruption Risk Indicators', text: Consts.IPSUM},
		{icon: 'icon-library', url: '/dashboards/administrative-capacity-indicators', title: 'Administrative Capacity', subtitle: 'Explore Administrative Capacity Indictors', text: Consts.IPSUM},
		{icon: 'icon-checkmark', url: '/dashboards/transparency-indicators', title: 'Transparency', subtitle: 'Explore Transparency Indicators', text: Consts.IPSUM},
		{icon: 'icon-hammer', url: '/dashboards/market-analysis', title: 'Market Analysis', subtitle: 'Explore Structure of Tenders', text: Consts.IPSUM}
	];

	constructor(private router: Router) {
		this.checkIsDashboardRootPage(this.router.url);
	}

	ngOnInit(): void {
		this.router.events.subscribe(e => {
			if (e instanceof NavigationEnd) {
				this.checkIsDashboardRootPage(e.url);
			}
		});
	}

	checkIsDashboardRootPage(url: string): void {
		this.isRootPage = url === '/dashboards';
	}
}
