import {Injectable, Inject} from '@angular/core';

export interface Portal {
	id: string;
	name: string;
	foi?: {name: string, url: string}
}

@Injectable()
export class PortalsService {
	private _portals: Array<Portal>;

	constructor(@Inject('portals') portals) {
		this._portals = portals.active;
		this._portals.sort((a, b) => {
			if (a.id === 'eu') {
				a.name = 'All available countries';
				return -1;
			}
			if (a.name < b.name) {
				return -1;
			}
			if (a.name > b.name) {
				return 1;
			}
			return 0;
		});
	}

	get(): Array<Portal> {
		return this._portals;
	}

}
