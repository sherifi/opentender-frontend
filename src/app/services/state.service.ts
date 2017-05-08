import {Injectable} from '@angular/core';

@Injectable()
export class StateService {
	private _config: any = {};

	constructor() {
	}

	get(key) {
		return this._config[key];
	}

	put(key, value) {
		this._config[key] = value;
	}

}
