import {Component, OnDestroy} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {ConfigService, Country} from '../../services/config.service';
import {routes} from '../../app.routes';
import {Subscription} from 'rxjs/Subscription';
import {I18NService} from '../../services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'header',
	templateUrl: 'header.component.html',
	styleUrls: ['header.component.scss']
})
export class HeaderComponent implements OnDestroy {
	public country: Country;
	public isRootPage = false;
	public menuActive = false;
	public current = null;
	public menu = [];
	public subscription: Subscription;

	constructor(public router: Router, private config: ConfigService, private i18n: I18NService) {
		this.country = config.country;
		this.isRootPage = this.country.id === null;
		this.buildMenu();
		this.subscription = this.router.events.subscribe(e => {
			if (e instanceof NavigationStart) {
				this.menuActive = false;
			} else if (e instanceof NavigationEnd) {
				this.setSubMenu();
			}
		});
	}

	public ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	private getCurrentUrl(): string {
		return (this.router.url || '').split('?')[0];
	}

	private setSubMenu() {
		let url = this.getCurrentUrl();
		this.current = this.menu.find(item => {
			if (item.path === '') {
				return (url === '/');
			}
			return url.indexOf('/' + item.path) === 0;
		});
	}

	private buildMenu() {
		this.menu = [];
		routes.forEach(route => {
			if (route.data && ((!this.isRootPage && route.data.menu) || (this.isRootPage && route.data.rootMenu))) {
				this.menu.push({
					path: route.path,
					title: this.i18n.get(route.data.menu_title || route.data.title),
					routerLink: route.data.routerLink ? route.data.routerLink : ['/' + route.path],
					submenu: (route.children || []).filter(sub => sub.data && sub.data.menu).map(sub => {
						return {
							path: sub.path,
							title: this.i18n.get(sub.data.menu_title || sub.data.title),
							routerLink: sub.data.routerLink ? sub.data.routerLink : ['/' + route.path + '/' + sub.path],
						};
					})
				});
			}
		});
	}

	public isActive(section: string): boolean {
		return this.current && (this.current.path === section);
	}

	public isActiveStart(): boolean {
		let url = this.getCurrentUrl();
		return (url === '/start');
	}

	public toggleMenu() {
		this.menuActive = !this.menuActive;
	}

}
