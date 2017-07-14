import {Component, OnInit, OnDestroy} from '@angular/core';
import {StateService} from '../../../services/state.service';
import {Search, SearchCommand} from '../../../model/search';
import {TenderFilterDefs, FilterDef} from '../../../model/filters';
import {ISearchTenderData} from '../../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'tender',
	templateUrl: 'tender.template.html'
})
export class SearchTenderPage implements OnInit, OnDestroy {
	title = 'Results';
	search = new Search('tender');
	search_cmd: SearchCommand;
	quick_search_filters: Array<FilterDef> = [];
	search_filters = TenderFilterDefs.filter(f => f.type !== 'select' && f.type !== 'range');
	check_filters = TenderFilterDefs.filter(f => f.type !== 'value');
	columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name', 'lots.bids.price'];
	filterIds = ['indicators.type_cri', 'indicators.type_aqi', 'indicators.type_ti', 'lots.awardDecisionDate'];
	searchIds = ['title', 'buyers.name', 'lots.bids.bidders.name'];
	quicksearchIds = []; // 'title', 'buyers.name', 'buyers.address.city', 'lots.bids.bidders.name', 'lots.bids.bidders.address.city', 'finalPrice.netAmount'];

	constructor(private state: StateService) {
		this.search.build(this.check_filters.filter(def => {
			return this.filterIds.indexOf(def.id) >= 0;
		}));
		this.search_filters.filter(def => {
			if (this.searchIds.indexOf(def.id) >= 0) {
				this.search.addSearch(def);
			}
		});
		this.quick_search_filters = this.search_filters.filter(def => {
			return (this.quicksearchIds.indexOf(def.field) >= 0);
		});
	}

	ngOnInit(): void {
		let state = this.state.get('search.tender');
		if (state) {
			this.columnIds = state.columnIds;
			this.search = state.search;
			this.search_cmd = state.search_cmd;
		} else {
			this.refresh();
		}
	}

	ngOnDestroy() {
		this.state.put('search.tender', {
			columnIds: this.columnIds,
			search: this.search,
			search_cmd: this.search_cmd
		});
	}

	searchChange(data: ISearchTenderData) {
		this.title = 'Tenders: ' + data.hits.total.toLocaleString();
		this.search.fillAggregationResults(data.aggregations);
	}

	refresh() {
		this.search_cmd = this.search.getCommand();
	};
}
