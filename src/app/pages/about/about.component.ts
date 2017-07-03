import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

@Component({
	moduleId: __filename,
	selector: 'about',
	templateUrl: 'about.template.html'
})
export class AboutPage implements OnInit {
	public isRootPage = false;

	constructor(private router: Router) {
		this.checkIsAboutRootPage(this.router.url);
	}

	ngOnInit(): void {
		this.router.events.subscribe(e => {
			if (e instanceof NavigationEnd) {
				this.checkIsAboutRootPage(e.url);
			}
		});
	}

	checkIsAboutRootPage(url: string): void {
		this.isRootPage = url === '/about';
	}
}
