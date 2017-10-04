import {Component, Input} from '@angular/core';
import {IStatsNuts} from '../../app.interfaces';
import {I18NService} from '../../services/i18n.service';

@Component({
	selector: 'graph[suppliernutsmap]',
	template: `
		<div class="graph-title" i18n>Suppliers by Region</div>
		<graph nutsmap [data]="data" [level]="1" [title]="title"></graph>`
})
export class GraphSupplierNutsMapComponent {
	@Input()
	data: IStatsNuts;
	title: string;

	constructor(private i18n: I18NService) {
		this.title = this.i18n.get('Suppliers');
	}
}
