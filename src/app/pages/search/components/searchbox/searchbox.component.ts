import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {Search} from '../../../../model/search';
import {I18NService} from '../../../../modules/i18n/services/i18n.service';
import {ISearchFilter, ISearchFilterDef, ISearchFilterDefType, ISearchResultBucket} from '../../../../app.interfaces';
import {bestFilterColCount} from '../../../../model/helpers';
import {Subject} from 'rxjs/Subject';
import {Utils} from '../../../../model/utils';
import {PlatformService} from '../../../../services/platform.service';

@Component({
	moduleId: __filename,
	selector: 'search-box',
	templateUrl: 'searchbox.component.html',
	styleUrls: ['searchbox.component.scss']
})
export class SearchBoxComponent {
	@Input()
	public search: Search;
	@Input()
	public filters: Array<ISearchFilter>;
	@Output()
	public onChange = new EventEmitter();
	ISearchFilterDefType: typeof ISearchFilterDefType = ISearchFilterDefType;

	public active_filters: Array<ISearchFilterDef> = [];
	private searchChangeEmitter: EventEmitter<any> = new EventEmitter<any>();
	private searchUpdated: Subject<any> = new Subject<any>();

	constructor(private platform: PlatformService, private i18n: I18NService) {
		this.searchChangeEmitter = <any>this.searchUpdated.asObservable()
			.debounceTime(400)
			.distinctUntilChanged(); // accept only relevant chars
		this.searchChangeEmitter.subscribe(() => {
			this.onChange.next('');
		});
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.active_filters = this.search.getActiveFilterDefs();
		this.triggerChange(true);
	}

	public onSelectSearch(data: { value: { filter: ISearchFilterDef, isSearch:boolean } }): void {
		if (data.value.isSearch) {
		this.search.addSearch(data.value.filter);
		} else {
			this.search.toggleFilter(data.value.filter);
			this.active_filters = this.search.getActiveFilterDefs();
			this.triggerChange(true);
		}
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

	getPlaceholder(filter) {
		return this.i18n.get(filter.def.group) + ': ' + this.i18n.get(filter.def.name);
	}

	getSearchFilterClass(index) {
		return 'filter-col-' + bestFilterColCount(index, this.search.searches.length);
	}

	refresh() {
		this.onChange.emit();
	}

	public onSelectFilters(data: { value: { filter: ISearchFilterDef } }): void {
		this.search.toggleFilter(data.value.filter);
		this.active_filters = this.search.getActiveFilterDefs();
		this.triggerChange(true);
	}

	public getValueTitle(bucket: ISearchResultBucket, filter: ISearchFilter): string {
		if (bucket.name) {
			return bucket.name;
		}
		if (filter.def.valueFormatter) {
			return filter.def.valueFormatter(bucket.key);
		}
		if (filter.def.valueTranslater) {
			return filter.def.valueTranslater(bucket.key, this.i18n);
		}
		return bucket.key;
	}

	public getFilterClass(index: number): string {
		return 'filter-col-' + bestFilterColCount(index, this.active_filters.length);
	}

	public closeFilter(filter: ISearchFilter) {
		this.search.toggleFilter(filter.def);
		this.active_filters = this.search.getActiveFilterDefs();
		this.triggerChange(true);
	}

	public triggerChange(resize?: boolean) {
		this.onChange.next('');
		if (resize && this.platform.isBrowser) {
			Utils.triggerResize();
		}
	}

}
