/// <reference path="../../typings.d.ts" />

import {Injectable, Inject, LOCALE_ID} from '@angular/core';
import {PlatformService} from './platform.service';
import {I18NService} from '../components/i18n/services/i18n.service';

export interface Country {
	id: string;
	name: string;
	ip?: Country;
	foi?: any;
}

@Injectable()
export class ConfigService {
	public config: ClientConfig;
	public country: Country;
	public absUrl: string = '';
	public locale: string;
	public contactmail = 'digiwhist@okfn.de';
	public languages = [{id: 'de', name: 'Deutsch'}, {id: 'en', name: 'English'}];

	constructor(@Inject('opentender') externalConfig,
				@Inject('absurl') externalAbsUrl,
				@Inject(LOCALE_ID) externalLocale,
				private platform: PlatformService,
				private i18n: I18NService) {
		this.locale = null;
		if (externalLocale) {
			this.locale = externalLocale.slice(0, 2).toLowerCase();
		}
		let config = externalConfig;
		if (!config && this.platform.isBrowser) {
			config = document['opentender'];
		}
		if (!platform.isBrowser) {
			this.absUrl = externalAbsUrl;
		}
		if (config) {
			this.config = config.config;
			this.country = config.country;
			if (this.locale !== 'en') {
				this.country.name = i18n.getPortalName(config.country.id, config.country.name);
			}
		} else {
			this.config = {backendUrl: null, version: 'unknown', devMode: true};
			this.country = {id: null, name: 'General', foi: null};
		}
	}

}
