import {Component, OnDestroy} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {ConfigService, Country} from '../../services/config.service';
import {Subscription} from 'rxjs/Subscription';
import {I18NService} from '../../modules/i18n/services/i18n.service';
import {Consts} from '../../model/consts';

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
		Consts.routes.forEach(route => {
			if ((!this.isRootPage && route.menu) || (this.isRootPage && route.rootMenu)) {
				this.menu.push({
					path: route.path,
					title: this.i18n.get(route.menu_title || route.title),
					routerLink: route.routerLink ? route.routerLink : ['/' + route.path],
					submenu: (route.children || []).filter(sub => sub.menu).map(sub => {
						return {
							path: sub.path,
							title: this.i18n.get(sub.menu_title || sub.title),
							routerLink: sub.routerLink ? sub.routerLink : ['/' + route.path + '/' + sub.path],
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
