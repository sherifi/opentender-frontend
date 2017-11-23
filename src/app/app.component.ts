import {Component, OnInit, ElementRef} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {TitleService} from './services/title.service';
import {PlatformService} from './services/platform.service';
import {I18NService} from './services/i18n.service';

/**
 * The root component for the opentender that is bootstrapped by angular
 */

@Component({
	selector: 'app',
	templateUrl: 'app.template.html'
})
export class App implements OnInit {

	/**
	 * is the current page a share page (to not include header & footer)
	 */
	public isSharePage: boolean = false;

	constructor(private router: Router, private el: ElementRef, private titleService: TitleService, private platform: PlatformService, private i18n: I18NService) {
		i18n.init();
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
				if (e instanceof NavigationEnd) {
					this.checkURL(e.url);
					this.scrollToTop();
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
		this.isSharePage = (url === '/share');
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
