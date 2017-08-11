/// <reference path="../../typings.d.ts" />

import {Injectable, Inject} from '@angular/core';
import {PlatformService} from './platform.service';

@Injectable()
export class ConfigService {
	private _config: ClientConfig;
	absUrl = '';

	constructor(@Inject('config') externalConfig, @Inject('absurl') externalAbsUrl, private platform: PlatformService) {
		let config = externalConfig;
		if (!config && this.platform.isBrowser) {
			config = document['config'];
		}
		if (!platform.isBrowser) {
			this.absUrl = externalAbsUrl;
		}
		if (config) {
			this._config = config;
		} else {
			this._config = {backendUrl: null, version: 'unknown'};
		}
	}

	get(value) {
		return this._config[value];
	}

}
