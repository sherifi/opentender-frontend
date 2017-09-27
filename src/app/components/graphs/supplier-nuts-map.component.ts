import {Component, Input} from '@angular/core';
import {IStatsNuts} from '../../app.interfaces';

@Component({
	selector: 'graph[suppliernutsmap]',
	template: `<div class="graph-title" i18n>Suppliers by Region</div><graph nutsmap [data]="data" [level]="1" [title]="'Suppliers'"></graph>`
})
export class GraphSupplierNutsMapComponent {
	@Input()
	data: IStatsNuts;

}
