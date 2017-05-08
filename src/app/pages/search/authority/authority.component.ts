import {Component, OnInit, OnDestroy} from '@angular/core';
import {SearchCommand, Search} from '../../../model/search';
import {StateService} from '../../../services/state.service';
import {AuthorityFilterDefs, FilterDef} from '../../../model/filters';
import {ISearchAuthorityData} from '../../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'authority',
	templateUrl: 'authority.template.html'
})
export class SearchAuthorityPage implements OnInit, OnDestroy {
	title = 'Authorities';
	search = new Search('authority', AuthorityFilterDefs);
	search_cmd: SearchCommand;
	columnIds = ['id', 'body.name', 'body.address.city', 'body.address.country'];
	check_filters = AuthorityFilterDefs;
	search_filters = AuthorityFilterDefs.filter(f => f.type !== 'select');

	constructor(private state: StateService) {
		this.search.filters.forEach(filter => {
			filter.active = true;
		});
		this.search_filters.forEach(filter => {
			this.search.addSearch(filter);
		});
	}

	ngOnInit(): void {
		let state = this.state.get('search.authority');
		if (state) {
			this.columnIds = state.columnIds;
			this.search = state.search;
			this.search_cmd = state.search_cmd;
		} else {
			this.refresh();
		}
	}

	ngOnDestroy() {
		this.state.put('search.authority', {
			columnIds: this.columnIds,
			search: this.search,
			search_cmd: this.search_cmd
		});
	}

	searchChange(data: ISearchAuthorityData) {
		this.title = 'Results: ' + (data.hits.total == 1000 ? '> ' : '') + data.hits.total;
		this.search.fillAggregationResults(data.aggregations);
	}

	refresh() {
		this.search_cmd = this.search.getCommand();
	};
}
