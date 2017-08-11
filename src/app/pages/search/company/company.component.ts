import {Component, OnDestroy, OnInit} from '@angular/core';
import {Search, SearchCommand} from '../../../model/search';
import {StateService} from '../../../services/state.service';
import {CompanyFilterDefs, FilterType} from '../../../model/filters';
import {ISearchCompanyData} from '../../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'company',
	templateUrl: 'company.template.html'
})
export class SearchCompanyPage implements OnInit, OnDestroy {
	title = 'Companies';
	search = new Search('company', CompanyFilterDefs);
	search_cmd: SearchCommand;
	columns = ['id', 'body.name', 'body.address.city', 'body.address.country'];
	quick_filters = [];
	check_filters = CompanyFilterDefs;
	search_filters = CompanyFilterDefs.filter(f => f.type !== FilterType.select);

	constructor(private state: StateService) {
		this.search.filters.forEach(filter => {
			filter.active = true;
		});
		this.search_filters.forEach(filter => {
			this.search.addSearch(filter);
		});
	}

	ngOnInit(): void {
		let state = this.state.get('search.company');
		if (state) {
			this.columns = state.columns;
			this.search = state.search;
			this.search_cmd = state.search_cmd;
		} else {
			this.refresh();
		}
	}

	ngOnDestroy() {
		this.state.put('search.company', {
			columns: this.columns,
			search: this.search,
			search_cmd: this.search_cmd
		});
	}

	searchChange(data: ISearchCompanyData) {
		let total = data.hits && data.hits.total ? data.hits.total : 0;
		this.title = 'Results: ' + (total == 1000 ? '> ' : '') + total.toLocaleString();
		this.search.fillAggregationResults(data.aggregations);
	}

	refresh() {
		this.search_cmd = this.search.getCommand();
	};
}
