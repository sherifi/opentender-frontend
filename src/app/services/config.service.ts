/// <reference path="../../typings.d.ts" />

import {Injectable, Inject} from '@angular/core';
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
	absUrl = '';

	constructor(@Inject('opentender') externalConfig, @Inject('absurl') externalAbsUrl, private platform: PlatformService) {
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
