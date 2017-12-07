import {Component} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {ConfigService, Country} from '../../services/config.service';
import {routes} from '../../app.routes';

@Component({
	moduleId: __filename,
	selector: 'header',
	templateUrl: 'header.component.html',
	styleUrls: ['header.component.scss']
})
export class HeaderComponent {
	public country: Country;
	public isRootPage = false;
	public menuActive = false;
	public current = null;
	public menu = [];

	constructor(public router: Router, private config: ConfigService) {
		this.country = config.country;
		this.isRootPage = this.country.id === null;
		this.buildMenu();
		this.router.events.subscribe(e => {
			if (e instanceof NavigationStart) {
				this.menuActive = false;
			} else if (e instanceof NavigationEnd) {
				this.setSubMenu();
			}
		});
	}

	private setSubMenu() {
		this.current = this.menu.find(item => {
			if (item.path === '') {
				return (this.router.url === '/');
			}
			return (this.router.url || '').indexOf('/' + item.path) === 0;
		});
	}

	private buildMenu() {
		this.menu = [];
		routes.forEach(route => {
			if (route.data && ((!this.isRootPage && route.data.menu) || (this.isRootPage && route.data.rootMenu))) {
				this.menu.push({
					path: route.path,
					title: route.data.menu_title || route.data.title,
					routerLink: route.data.routerLink ? route.data.routerLink : ['/' + route.path],
					submenu: (route.children || []).filter(sub => sub.data && sub.data.menu).map(sub => {
						return {
							path: sub.path,
							title: sub.data.menu_title || sub.data.title,
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
		return (this.router.url === '/start');
	}

	public toggleMenu() {
		this.menuActive = !this.menuActive;
	}

}
