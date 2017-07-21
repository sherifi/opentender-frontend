import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ICompany, IStatsCompanies} from '../../app.interfaces';

@Component({
	selector: 'graph[companies]',
	template: `
		<h2>Main suppliers</h2>
		<table class="tables">
			<tr>
				<th>Supplier</th>
				<th>Nr. of Tenders</th>
			</tr>
			<tr *ngFor="let val of companies">
				<td>
					<tender-body-line [body]="val.body" [link]="'/company/'+val.body.groupId"></tender-body-line>
				</td>
				<td>{{val.value | formatNumber}}</td>
			</tr>
		</table>
	`
})
export class GraphCompaniesComponent implements OnChanges {
	@Input()
	data: IStatsCompanies;
	companies: Array<ICompany> = [];

	constructor() {
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.companies = this.data && this.data.top10 ? this.data.top10 : [];
	}

}
