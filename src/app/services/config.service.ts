/// <reference path="../../typings.d.ts" />

import {Injectable, Inject, LOCALE_ID} from '@angular/core';
import {PlatformService} from './platform.service';

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

	constructor(@Inject('opentender') externalConfig, @Inject('absurl') externalAbsUrl, @Inject(LOCALE_ID) externalLocale, private platform: PlatformService) {
		this.locale = externalLocale;
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
		} else {
			this.config = {backendUrl: null, version: 'unknown'};
			this.country = {id: null, name: 'General', foi: null};
		}
	}

}
