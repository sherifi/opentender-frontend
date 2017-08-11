import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Filter, Search} from '../model/search';
import {FilterType} from '../model/filters';

@Component({
	moduleId: __filename,
	selector: 'search-box',
	templateUrl: 'searchbox.component.html'
})
export class SearchBoxComponent {
	@Input()
	public search: Search;
	@Input()
	public filters: Array<Filter>;
	@Input()
	public quick_filters: Array<Filter>;
	@Output()
	public onChange = new EventEmitter();
	FilterType: typeof FilterType = FilterType;

	constructor() {
	}

	addSearch(filterDef) {
		this.search.addSearch(filterDef);
	}

	onSelectSearch(event) {
		this.search.addSearch(event.value.filter);
	}

	closeSearch(searchFilter) {
		this.search.removeSearch(searchFilter);
		this.refresh();
	}

	onSelectSearchEntry(data, searchEntry) {
		searchEntry.value = (data.value || '').trim();
		this.refresh();
	}

	onSelectSearchValueEntry(data, searchEntry) {
		searchEntry.value = (data.value || '').trim();
		searchEntry.mode = data.mode;
		this.refresh();
	}

	getFilterClass(index) {
		let count = this.search.searches.length;
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

	refresh() {
		this.onChange.emit();
	}

}
