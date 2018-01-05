import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Search} from '../../../../model/search';
import {I18NService} from '../../../../modules/i18n/services/i18n.service';
import {ISearchFilter, ISearchFilterDefType} from '../../../../app.interfaces';
import {bestFilterColCount} from '../../../../model/helpers';

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
	@Input()
	public quick_filters: Array<ISearchFilter>;
	@Output()
	public onChange = new EventEmitter();
	ISearchFilterDefType: typeof ISearchFilterDefType = ISearchFilterDefType;

	constructor(private i18n: I18NService) {
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

	getPlaceholder(filter) {
		return this.i18n.get(filter.def.group) + ': ' + this.i18n.get(filter.def.name);
	}

	getFilterClass(index) {
		return 'filter-col-' + bestFilterColCount(index, this.search.searches.length);
	}

	refresh() {
		this.onChange.emit();
	}

}
