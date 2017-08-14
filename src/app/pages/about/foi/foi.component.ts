import {Component} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Country} from '../../../services/config.service';

@Component({
	moduleId: __filename,
	selector: 'foi',
	templateUrl: 'foi.template.html'
})
export class AboutFOIPage {
	portals: Array<Country>;

	constructor(private api: ApiService) {
		this.api.getPortals().subscribe(
			(result) => this.display(result.data),
			(error) => console.error(error),
			() => {
				// console.log('getPortals complete');
			});
	}

	private display(data: Array<Country>) {
		this.portals = data;
	}
}
