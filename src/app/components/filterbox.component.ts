import {Component, EventEmitter, Input, Output, OnChanges, SimpleChanges} from '@angular/core';
import {Filter, Search} from '../model/search';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {FilterDef} from '../model/filters';
import {PlatformService} from '../services/platform.service';

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

	constructor(private platform: PlatformService) {
		this.searchChangeEmitter = <any>this.searchUpdated.asObservable()
			.debounceTime(400)
			.distinctUntilChanged(); // accept only relevant chars
		this.searchChangeEmitter.subscribe(() => {
			this.onChange.next('');
		});
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.active_filters = this.search.getActiveFilterDefs();
		this.refresh(true);
	}

	onSelectFilters(data) {
		this.search.toggleFilter(data.value.filter);
		this.active_filters = this.search.getActiveFilterDefs();
		this.refresh(true);
	}

	getValueTitle(bucket, filter) {
		if (bucket.name) {
			return bucket.name;
		}
		if (filter.def.valueFormatter) {
			return filter.def.valueFormatter(bucket.key);
		}
		return bucket.key;
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
		this.active_filters = this.search.getActiveFilterDefs();
		this.refresh(true);
	}

	clearFilter(filter) {
		filter.value = '';
		this.refresh();
	}

	refreshDelay(value) {
		this.searchUpdated.next(value);
	}

	refresh(resize?: boolean) {
		this.onChange.next('');
		if (resize && this.platform.isBrowser) {
			setTimeout(() => {
				// console.log('trigger resizes');
				let evt = window.document.createEvent('UIEvents');
				evt.initUIEvent('resize', true, false, window, 0);
				window.dispatchEvent(evt);
			}, 0);
		}
	}
}
