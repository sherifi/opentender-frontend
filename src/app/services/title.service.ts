import {Injectable, OnDestroy} from '@angular/core';
import {Router, NavigationStart, ActivatedRoute, NavigationEnd} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';
import {ConfigService} from './config.service';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class TitleService implements OnDestroy {
	private defaultName: string = 'Opentender';
	private subscription: Subscription;

	constructor(private activatedRoute: ActivatedRoute, private config: ConfigService, private router: Router, private titleService: Title, private meta: Meta) {
		let c = config.country;
		if (c.id) {
			this.defaultName += ' ' + c.name;
		}
		this.subscription = router.events.subscribe(e => {
			if (e instanceof NavigationStart) {
				this.setDefault();
			} else if (e instanceof NavigationEnd) {
				let route = this.activatedRoute;
				while (route.firstChild) {
					route = route.firstChild;
				}
				if (route.data && route.data['value'] && route.data['value'].title) {
					this.set(route.data['value'].title);
				} else {
					this.setDefault();
				}
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	public setDefault(): void {
		this.set('');
	}

	public set(value: string): void {
		let result = (value || '').trim();
		if (result.length > 60) {
			result = result.slice(0, 60) + '…';
		}
		let title = (result.length > 0 ? result + ' - ' : '') + this.defaultName;
		this.titleService.setTitle(title);
		title = this.defaultName + (result.length > 0 ? ' - ' + result : '');
		this.meta.updateTag({name: 'og:title', content: title});
	}

}
