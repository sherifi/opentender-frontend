declare let gtag: Function;

import {Component, OnInit, ElementRef} from '@angular/core';
import {NavigationCancel, NavigationEnd, Router, RoutesRecognized} from '@angular/router';
import {TitleService} from './services/title.service';
import {PlatformService} from './services/platform.service';

/**
 * The root component for the opentender that is bootstrapped by angular
 */

@Component({
	selector: 'app',
	templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
	public loading: boolean = false;

	constructor(private router: Router, private el: ElementRef, private titleService: TitleService, private platform: PlatformService) {
		titleService.setDefault();
		if (this.platform.isBrowser) {
			this.checkURL(router.url);
		}
	}

	/**
	 *  register the router listener to check & fix on router url change
	 */
	ngOnInit(): void {
		if (this.platform.isBrowser) {
			this.router.events.subscribe(e => {
				if (e instanceof RoutesRecognized) {
					this.loading = true;
				} else if (e instanceof NavigationCancel) {
					this.loading = false;
				} else if (e instanceof NavigationEnd) {
					this.loading = false;
					this.checkURL(e.url);
					this.scrollToTop();
					gtag('config', 'UA-23514826-4', {
					  'page_title' : document.title,
					  'page_location': window.location
					});
				}
			});
		}
	}

	/**
	 *  check if the current router url is a share page
	 *
	 *  check if the current router url is the root page, redirect if true to start page
	 */
	checkURL(url: string): void {
		url = (url || '').split('?')[0];
		if ((location.pathname == '/' && (url !== '/start')) || (location.pathname == '' && (url !== 'start'))) {
			this.router.navigate(['/start']);
		}
	}

	/**
	 *  on changing the page on the single page app, the browser keeps the last scroll position
	 *  this scrolls the page all up
	 */
	scrollToTop(): void {
		let document = this.el.nativeElement.ownerDocument;
		if (document && document.documentElement) {
			document.documentElement.scrollTop = 0;
			// document.scrollTo(0, 0);
			if (window.scrollTo) {
				window.scrollTo(0, 0);
			}
		}
	}

}
