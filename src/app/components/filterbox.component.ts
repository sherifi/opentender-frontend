import {Component, EventEmitter, Input, Output, OnChanges, SimpleChanges} from '@angular/core';
import {Filter, Search} from '../model/search';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {FilterDef} from '../model/filters';

@Component({
	moduleId: __filename,
	selector: 'filter-box',
	templateUrl: 'filterbox.component.html'
})
export class FilterBoxComponent implements OnChanges {

	@Input()
	public search: Search;
	@Input()
	public filters: Array<Filter>;
	@Output()
	public onChange = new EventEmitter();
	public active_filters: Array<FilterDef> = [];
	private searchChangeEmitter: EventEmitter<any> = new EventEmitter<any>();
	private searchUpdated: Subject<any> = new Subject<any>();

	constructor() {
		this.searchChangeEmitter = <any>this.searchUpdated.asObservable()
			.debounceTime(400)
			.distinctUntilChanged(); // accept only relevant chars
		this.searchChangeEmitter.subscribe(() => {
			this.onChange.next('');
		});
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.active_filters = this.search.getActiveFilterDefs();
	}

	onSelectFilters(data) {
		this.search.toggleFilter(data.value.filter);
		this.active_filters = this.search.getActiveFilterDefs();
		this.refresh();
	}

	getFilterClass(index) {
		let count = this.active_filters.length;
		let col = 4;
		if (count < 3) {
			col = 2;
		} else if (count < 4) {
			col = 3;
		}
		let rows = Math.floor(count / col) + 1;
		let currentrow = Math.floor(index / col);
		if (currentrow == rows - 1) {
			let itemsleft = col - (rows * col - count);
			col = Math.max(itemsleft, 2);
		}
		return 'filter-col-' + col;
	}

	closeFilter(filter) {
		this.search.toggleFilter(filter.def);
		this.onChange.next('');
	}

	clearFilter(filter) {
		filter.value = '';
		this.onChange.next('');
	}

	refreshDelay(value) {
		this.searchUpdated.next(value);
	}

	refresh() {
		this.onChange.next('');
	}
}
