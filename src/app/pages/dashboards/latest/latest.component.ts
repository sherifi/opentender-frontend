import {Component} from '@angular/core';
import {SearchCommand} from '../../../model/search';

@Component({
	moduleId: __filename,
	selector: 'latest',
	templateUrl: 'latest.template.html'
})
export class DashboardsLatestPage {
	title = 'Latest Tenders';
	columnIds = ['id', 'modified', 'titleEnglish', 'buyers.name', 'lots.bids.bidders.name', 'bidDeadline'];
	search_cmd = new SearchCommand();

	constructor() {
		this.search_cmd.filters = [{field: 'modified', value: ['recent'], type: 'date', sort: 'desc'}];
	}

}
