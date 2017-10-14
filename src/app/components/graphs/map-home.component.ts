import {Component} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {IStatsNuts} from '../../app.interfaces';
import {NotifyService} from '../../services/notify.service';
import {I18NService} from '../../services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'home-map',
	templateUrl: 'map-home.template.html'
})
export class HomeMapComponent {
	private map_level: number = 2;
	private map_companies: boolean = false;
	private map_data: IStatsNuts = null;
	private formatTooltip: (featureProperties: any) => string;
	private loading: number = 0;
	private title: string = '';

	constructor(private api: ApiService, private notify: NotifyService, private i18n: I18NService) {
		this.formatTooltip = this.formatTooltipCallback.bind(this);
		this.fillMap(this.map_level);
	}

	toggle() {
		this.map_companies = !this.map_companies;
		this.fillMap(this.map_level);
	}

	getTitle() {
		return this.i18n.get(this.map_companies ? 'Number of Suppliers by Region' : 'Number of Buyers by Region');
	}

	formatTooltipCallback(featureProperties) {
		return featureProperties.name + ': ' + featureProperties.value + ' ' + (this.i18n.get(this.map_companies ? 'Suppliers' : 'Buyers'));
	}

	fillMap(level) {
		this.title = this.getTitle();
		if (this.map_companies) {
			this.loading++;
			this.api.getCompanyNutsStats().subscribe(
				(result) => {
					this.map_level = level;
					this.map_data = result.data;
				},
				(error) => {
					this.notify.error(error);
				},
				() => {
					this.loading--;
				}
			);
		} else {
			this.loading++;
			this.api.getAuthorityNutsStats().subscribe(
				(result) => {
					this.map_level = level;
					this.map_data = result.data;
				},
				(error) => {
					this.notify.error(error);
				},
				() => {
					this.loading--;
				}
			);
		}
	}

	setLevel(level) {
		this.fillMap(level);
	}
}
