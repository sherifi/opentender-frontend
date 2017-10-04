import {Component, Input} from '@angular/core';
import {IStatsNuts} from '../../app.interfaces';
import {I18NService} from '../../services/i18n.service';

@Component({
	selector: 'graph[buyer-nutsmap]',
	template: `<div class="graph-title" i18n>Buyers by Region</div><graph nutsmap [data]="data" [level]="1" [title]="title"></graph>`
})
export class GraphBuyerNutsMapComponent {
	@Input()
	data: IStatsNuts;
	title: string;

	constructor(private i18n: I18NService) {
		this.title = this.i18n.get('Buyers');
	}
}
