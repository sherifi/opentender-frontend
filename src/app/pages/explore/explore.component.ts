import {Component} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {Consts} from '../../model/consts';

@Component({
	moduleId: __filename,
	selector: 'explore',
	templateUrl: 'explore.template.html'
})
export class ExplorePage {
	public isRootPage = false;
	public cards = [
		{icon: 'icon-hammer', url: '/explore/sectors', title: 'Sectors', subtitle: 'Explore Structure of Tenders', text: Consts.IPSUM},
		{icon: 'icon-flag', url: '/explore/corruption-indicators', title: 'Corruption Risk', subtitle: 'Explore Corruption Risk Indicators', text: Consts.IPSUM},
		{icon: 'icon-library', url: '/explore/administrative-quality', title: 'Administrative Quality', subtitle: 'Explore Administrative Quality', text: Consts.IPSUM},
		{icon: 'icon-checkmark', url: '/explore/transparency-indicators', title: 'Transparency', subtitle: 'Explore Transparency Indicators', text: Consts.IPSUM},
		{icon: 'icon-briefcase', url: '/explore/rankings', title: 'Rankings', subtitle: 'Explore Top/Bottom Performers', text: Consts.IPSUM},
		{icon: 'icon-history', url: '/explore/latest', title: 'Latest', subtitle: 'Explore Latest Tenders', text: Consts.IPSUM}
	];

	constructor(private router: Router) {
	}

	ngOnInit(): void {
		this.router.events.subscribe(e => {
			if (e instanceof NavigationEnd) {
				this.isRootPage = e.url === '/explore';
			}
		});
	}
}
