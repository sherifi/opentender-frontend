import {Component, Input} from '@angular/core';
import {IStatsNuts} from '../../app.interfaces';
import {I18NService} from '../i18n/services/i18n.service';

@Component({
	selector: 'graph[supplier-nutsmap]',
	template: `
		<div class="graph-title" i18n>Suppliers by Region</div>
		<div class="graph-toolbar-container">
			<div class="graph-toolbar graph-toolbar-right">
				<button class="tool-button" [ngClass]="{down:map_level==1}" (click)="setLevel(1)" i18n>NUTS 1</button>
				<button class="tool-button" [ngClass]="{down:map_level==2}" (click)="setLevel(2)" i18n>NUTS 2</button>
				<button class="tool-button" [ngClass]="{down:map_level==3}" (click)="setLevel(3)" i18n>NUTS 3</button>
			</div>
		</div>
		<graph nutsmap [data]="data" [level]="map_level" [title]="title"></graph>`
})
export class MapSuppliersComponent {
	@Input()
	data: IStatsNuts;
	title: string;
	map_level: number = 2;

	constructor(private i18n: I18NService) {
		this.title = this.i18n.get('Suppliers');
	}

	setLevel(lvl: number): void {
		this.map_level = lvl;
	}
}
