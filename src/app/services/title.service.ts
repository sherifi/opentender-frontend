import {Injectable, OnDestroy} from '@angular/core';
import {Router, NavigationStart, NavigationEnd} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';
import {ConfigService} from './config.service';
import {Subscription} from 'rxjs/Subscription';
import {I18NService} from '../modules/i18n/services/i18n.service';
import {Consts} from '../model/consts';

@Injectable()
export class TitleService implements OnDestroy {
	private defaultName: string = 'Opentender';
	private subscription: Subscription;

	getRouteData(url: string) {
		let findRoute = (pos: number, parts: Array<String>, children) => {
			let route = children.find(child => child.path == parts[pos]);
			if (route && route.children && pos + 1 < parts.length) {
				return findRoute(pos + 1, parts, route.children);
			}
			return route;
		};
		let urlparts = (url.length === 0) ? ['/'] : url.split('?')[0].split('/');
		return findRoute(1, urlparts, Consts.routes);
	}

	constructor(private config: ConfigService, private router: Router, private titleService: Title, private meta: Meta, i18n: I18NService) {
		let c = config.country;
		if (c.id) {
			this.defaultName += ' ' + c.name;
		}
		this.subscription = router.events.subscribe(e => {
			if (e instanceof NavigationStart) {
				this.setDefault();
			} else if (e instanceof NavigationEnd) {
				const data = this.getRouteData(this.router.url);
				if (data && data.title) {
					this.set(i18n.get(data.title));
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
		this.meta.updateTag({property: 'og:title', content: title});
	}

}
