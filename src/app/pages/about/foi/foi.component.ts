import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Country} from '../../../services/config.service';

/**
 * The /about/foi component displays information on all known foi portals that can be connection with opentender
 */

@Component({
	moduleId: __filename,
	selector: 'foi',
	templateUrl: 'foi.component.html'
})
export class AboutFOIPage implements OnInit {

	portals: Array<Country>;

	constructor(private api: ApiService) {
	}

	/**
	 * request the list of countries with foi portals informations
	 */
	public ngOnInit(): void {
		let sub = this.api.getPortals().subscribe(
			(result) => this.portals = result.data,
			(error) => console.error(error),
			() => {
				sub.unsubscribe();
			});
	}
}
