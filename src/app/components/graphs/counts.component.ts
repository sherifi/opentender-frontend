import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IStatsCounts} from '../../app.interfaces';

@Component({
	selector: 'graph[counts]',
	template: `
		<div class="title">Total Number of Contracts</div>
		<div class="stats">
			<ul *ngIf="data">
				<li><span>Tenders</span><span>{{data.tenders | formatNumber}}</span></li>
				<li><span>Lots</span><span>{{data.lots | formatNumber}}</span></li>
				<li><span>Bids</span><span>{{data.bids | formatNumber}}</span></li>
				<li><span>Bids awarded</span><span>{{data.bids_awarded | formatNumber}}</span></li>
			</ul>
		</div>`
})
export class GraphCountsComponent implements OnChanges {
	@Input()
	data: IStatsCounts;

	constructor() {
	}

	ngOnChanges(changes: SimpleChanges): void {
	}

}
