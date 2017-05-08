import {Component, OnInit, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {TitleService} from './services/title.service';
import {PlatformService} from './services/platform.service';

@Component({
	selector: 'app',
	templateUrl: 'app.template.html'
})
export class App implements OnInit {

	constructor(private router: Router, private el: ElementRef, private titleService: TitleService, private platform: PlatformService) {
		titleService.setDefault();
	}

	ngOnInit(): void {
		if (this.platform.isBrowser) {
			let document = this.el.nativeElement.ownerDocument;
			if (document && document.documentElement) {
				this.router.events.subscribe(e => {
					let url = e['url'];
					if ((location.pathname == '/' && (url !== '/start')) || (location.pathname == '' && (url !== 'start'))) {
						this.router.navigate(['/start']);
						console.log('redirect', location.pathname, url);
					}
					if (url) {
						document.documentElement.scrollTop = 0;
						// document.scrollTo(0, 0);
						if (window.scrollTo) {
							window.scrollTo(0, 0);
						}
					}
				});
			}
		}
	}

}
