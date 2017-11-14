import {Component, OnDestroy, OnInit} from '@angular/core';
import {Search} from '../../../model/search';
import {StateService} from '../../../services/state.service';
import {CompanyFilterDefs} from '../../../model/filters';
import {ISearchResultCompany, ISearchFilterDefType, ISearchCommand} from '../../../app.interfaces';
import {Utils} from '../../../model/utils';
import {I18NService} from '../../../services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'search_company',
	templateUrl: 'company.template.html'
})
export class SearchCompanyPage implements OnInit, OnDestroy {
	title = '';
	search = new Search('company', CompanyFilterDefs);
	search_cmd: ISearchCommand;
	columns = ['id', 'body.name', 'body.address.city', 'body.address.country'];
	quick_filters = [];
	check_filters = CompanyFilterDefs;
	search_filters = CompanyFilterDefs.filter(f => f.type !== ISearchFilterDefType.select);

	constructor(private state: StateService, private i18n: I18NService) {
		this.search.filters.forEach(filter => {
			filter.active = true;
		});
		this.search_filters.forEach(filter => {
			this.search.addSearch(filter);
		});
		this.setTitle();
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

	setTitle(total?) {
		this.title = this.i18n.get('Companies') + (total !== null ? ': ' + Utils.formatValue(total) : '');
	}

	searchChange(data: ISearchResultCompany) {
		this.setTitle(data.hits && data.hits.total ? data.hits.total : 0);
		this.search.fillAggregationResults(data.aggregations);
	}

	refresh() {
		this.search_cmd = this.search.getCommand();
	}
}
