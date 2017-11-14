import {Component, OnInit, ElementRef} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {TitleService} from './services/title.service';
import {PlatformService} from './services/platform.service';

@Component({
	selector: 'app',
	templateUrl: 'app.template.html'
})
export class App implements OnInit {
	public isShare: boolean = false;

	constructor(private router: Router, private el: ElementRef, private titleService: TitleService, private platform: PlatformService) {
		titleService.setDefault();
		if (this.platform.isBrowser) {
			this.checkURL(router.url);
		}
	}

	checkURL(url) {
		this.isShare = (url === '/share');
		if ((location.pathname == '/' && (url !== '/start')) || (location.pathname == '' && (url !== 'start'))) {
			this.router.navigate(['/start']);
		}
		if (url) {
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

	ngOnInit(): void {
		if (this.platform.isBrowser) {
			this.router.events.subscribe(e => {
				if (e instanceof NavigationEnd) {
					this.checkURL(e.url);
				}
			});
		}
	}

}
