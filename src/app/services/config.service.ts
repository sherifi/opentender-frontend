import {Injectable, Inject} from '@angular/core';
import {PlatformService} from './platform.service';

@Injectable()
export class ConfigService {
	private _config: any;
	absUrl = '';

	constructor(@Inject('config') externalConfig, @Inject('absurl') externalAbsUrl, platform: PlatformService) {
		this._config = externalConfig;
		if (!platform.isBrowser) {
			this.absUrl = externalAbsUrl;
		}
	}

	setConfig(value) {
		this._config = value;
	}

	get(value) {
		return this._config[value];
	}

}
