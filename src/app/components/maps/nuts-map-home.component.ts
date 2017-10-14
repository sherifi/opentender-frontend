import {Component} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {IStatsNuts} from '../../app.interfaces';
import {NotifyService} from '../../services/notify.service';
import {I18NService} from '../../services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'home-nutsmap',
	template: `<div class="graph-header">
	<div class="graph-title">{{title}}</div>
	<div class="graph-toolbar-container">
		<div class="graph-toolbar graph-toolbar-left">
			<button class="tool-button" [ngClass]="{down:!map_companies}" (click)="toggle()" i18n>Buyers</button>
			<button class="tool-button" [ngClass]="{down:map_companies}" (click)="toggle()" i18n>Suppliers</button>
		</div>
		<div class="graph-toolbar graph-toolbar-right">
			<button class="tool-button" [ngClass]="{down:map_level==1}" (click)="setLevel(1)" i18n>NUTS 1</button>
			<button class="tool-button" [ngClass]="{down:map_level==2}" (click)="setLevel(2)" i18n>NUTS 2</button>
			<button class="tool-button" [ngClass]="{down:map_level==3}" (click)="setLevel(3)" i18n>NUTS 3</button>
		</div>
	</div>
</div>
<graph nutsmap [data]="map_data" [level]="map_level" [formatTooltip]="formatTooltip" [title]="title"></graph>
`
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
