import {Component} from '@angular/core';
import {PlatformService} from '../services/platform.service';
import {ApiService} from '../services/api.service';
import {IStatsNuts} from '../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'home-map',
	templateUrl: 'map-home.template.html'
})
export class HomeMapComponent {
	private map_level: number = 1;
	private map_companies: boolean = false;
	private map_data: IStatsNuts = null;
	private formatTooltip: (featureProperties: any) => string;

	constructor(private api: ApiService, private platform: PlatformService) {
		this.formatTooltip = this.formatTooltipCallback.bind(this);
		this.fillMap();
	}

	toggle() {
		this.map_companies = !this.map_companies;
		this.fillMap();
	}

	getEntitiesTitle() {
		return this.map_companies ? 'Companies' : 'Authorities';
	}

	formatTooltipCallback(featureProperties) {
		return featureProperties.name + ': ' + featureProperties.value + ' ' + this.getEntitiesTitle();
	}

	fillMap() {
		if (this.map_companies) {
			this.api.getCompanyNutsStats().subscribe(
				res => {
					this.map_data = res.data;
				},
				err => {
					console.error(err);
				},
				() => {
					// console.log('nuts complete');
				}
			);
		} else {
			this.api.getAuthorityNutsStats().subscribe(
				res => {
					this.map_data = res.data;
				},
				err => {
					console.error(err);
				},
				() => {
					// console.log('nuts complete');
				}
			);
		}
	}

	setLevel(level) {
		this.map_level = level;
		this.fillMap();
	}
}
