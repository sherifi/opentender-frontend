import {Component, OnDestroy} from '@angular/core';
import {IBreadcrumb} from '../../app.interfaces';
import {I18NService} from '../../modules/i18n/services/i18n.service';
import {Subscription} from 'rxjs/Subscription';
import {NavigationEnd, Router} from '@angular/router';
import {TitleService} from '../../services/title.service';

/**
 * The /about/ root component displays the subpages header
 */

@Component({
	moduleId: __filename,
	selector: 'about',
	template: '<breadcrumb [crumbs]="crumbs"></breadcrumb><router-outlet></router-outlet>'
})
export class AboutPage implements OnDestroy {
	public crumbs: Array<IBreadcrumb> = [];
	public subscription: Subscription;

	constructor(private router: Router, private i18n: I18NService, private titleService: TitleService) {
		this.buildCrumbs();
		this.subscription = this.router.events.subscribe(e => {
			if (e instanceof NavigationEnd) {
				this.buildCrumbs();
			}
		});
	}

	public buildCrumbs(): void {
		this.crumbs = [
			{
				name: this.i18n.get('About')
			}];
		const data = this.titleService.getRouteData(this.router.url);
		if (data && data.title) {
			this.crumbs.push({
				name: this.i18n.get(data.menu_title || data.title)
			});
		}
	}

	public ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

}
