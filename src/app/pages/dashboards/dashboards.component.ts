import {Component} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {Consts} from '../../model/consts';

@Component({
	moduleId: __filename,
	selector: 'explore',
	templateUrl: 'dashboards.template.html'
})
export class DashboardsPage {
	public isRootPage = false;
	public cards = [
		{icon: 'icon-hammer', url: '/dashboards/market-analysis', title: 'Market Analysis', subtitle: 'Explore Structure of Tenders', text: Consts.IPSUM},
		{icon: 'icon-checkmark', url: '/dashboards/transparency-indicators', title: 'Transparency', subtitle: 'Explore Transparency Indicators', text: Consts.IPSUM},
		{icon: 'icon-flag', url: '/dashboards/corruption-indicators', title: 'Corruption Risk', subtitle: 'Explore Corruption Risk Indicators', text: Consts.IPSUM},
		{icon: 'icon-library', url: '/dashboards/administrative-quality', title: 'Administrative Quality', subtitle: 'Explore Administrative Quality', text: Consts.IPSUM}
	];

	constructor(private router: Router) {
	}

	ngOnInit(): void {
		this.router.events.subscribe(e => {
			if (e instanceof NavigationEnd) {
				this.isRootPage = e.url === '/dashboards';
			}
		});
	}
}
