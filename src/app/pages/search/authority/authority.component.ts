import {Component, OnInit, OnDestroy} from '@angular/core';
import {SearchCommand, Search} from '../../../model/search';
import {StateService} from '../../../services/state.service';
import {AuthorityFilterDefs, FilterType} from '../../../model/filters';
import {ISearchAuthorityData} from '../../../app.interfaces';
import {I18NService} from '../../../services/i18n.service';
import {Utils} from '../../../model/utils';

@Component({
	moduleId: __filename,
	selector: 'search_authority',
	templateUrl: 'authority.template.html'
})
export class SearchAuthorityPage implements OnInit, OnDestroy {
	title = '';
	search = new Search('authority');
	search_cmd: SearchCommand;
	columnIds = ['id', 'body.name', 'body.address.city', 'body.mainActivities', 'body.buyerType'];
	filterIds = ['body.name', 'body.address.city', 'body.mainActivities', 'body.buyerType'];
	quick_filters = [];
	check_filters = AuthorityFilterDefs;
	search_filters = AuthorityFilterDefs.filter(f => f.type !== FilterType.select);

	constructor(private state: StateService, private i18n: I18NService) {
		this.search.build(this.check_filters.filter(def => {
			return this.filterIds.indexOf(def.id) >= 0;
		}));
		this.search_filters.forEach(filter => {
			this.search.addSearch(filter);
		});
		this.setTitle();
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

	setTitle(total?) {
		this.title = this.i18n.get('Authorities') + (total !== null ? ': ' + Utils.formatValue(total) : '');
	}

	searchChange(data: ISearchAuthorityData) {
		let total = data.hits && data.hits.total ? data.hits.total : 0;
		this.setTitle(total);
		this.search.fillAggregationResults(data.aggregations);
	}

	refresh() {
		this.search_cmd = this.search.getCommand();
	}
}
