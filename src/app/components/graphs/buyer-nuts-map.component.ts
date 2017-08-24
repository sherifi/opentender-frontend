import {Component, Input} from '@angular/core';
import {IStatsNuts} from '../../app.interfaces';

@Component({
	selector: 'graph[buyer-nutsmap]',
	template: `<div class="graph-title" i18n>Buyers by Region</div><graph nutsmap [data]="data" [level]="1"></graph>`
})
export class GraphBuyerNutsMapComponent {
	@Input()
	data: IStatsNuts;
}
