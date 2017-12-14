import {Component, OnDestroy} from '@angular/core';
import {ConfigService} from '../../services/config.service';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {I18NService} from '../../services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'footer',
	templateUrl: 'footer.component.html',
	styleUrls: ['footer.component.scss']
})
export class FooterComponent implements OnDestroy {
	public country: string;
	public version: string;
	public isRootPage: boolean = false;
	public contactmail: string;
	public languages = [];
	public url: string = '';
	public subscription: Subscription;

	constructor(public router: Router, private config: ConfigService, private i18n: I18NService) {
		this.contactmail = config.contactmail;
		this.country = config.country.name;
		this.version = config.config.version;
		this.isRootPage = this.config.country.id === null;
		const locale = config.locale || 'en';
		this.languages = i18n.languages.filter(lang => lang.id !== locale);
		this.subscription = this.router.events.subscribe(e => {
			if (e instanceof NavigationEnd) {
				this.url = (this.isRootPage ? '' : '/' + this.config.country.id) + this.router.url.split('?')[0];
			}
		});
	}

	public ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

}
