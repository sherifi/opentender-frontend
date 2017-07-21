import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IAuthority, IStatsAuthorities} from '../../app.interfaces';

@Component({
	selector: 'graph[authorities]',
	template: `
		<h2>Main buyers</h2>
		<table class="tables">
			<tr>
				<th>Buyer</th>
				<th>Nr. of Tenders</th>
			</tr>
			<tr *ngFor="let val of authorities">
				<td>
					<tender-body-line [body]="val.body" [link]="'/authority/'+val.body.groupId"></tender-body-line>
				</td>
				<td>{{val.value | formatNumber}}</td>
			</tr>
		</table>
	`
})
export class GraphAuthoritiesComponent implements OnChanges {
	@Input()
	data: IStatsAuthorities;
	authorities: Array<IAuthority> = [];

	constructor() {
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.authorities = this.data && this.data.top10 ? this.data.top10 : [];
	}

}
