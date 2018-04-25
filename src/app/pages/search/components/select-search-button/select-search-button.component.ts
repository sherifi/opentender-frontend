import {Component, Input, EventEmitter, Output, SimpleChanges, OnChanges} from '@angular/core';
import {ISearchFilterDef, ISearchFilterDefType} from '../../../../app.interfaces';
import {I18NService} from '../../../../modules/i18n/services/i18n.service';
import {isFilterDef, isSearchDef} from '../../../../model/filters';

@Component({
	moduleId: __filename,
	selector: 'select-search-button',
	templateUrl: 'select-search-button.component.html',
	styleUrls: ['select-search-button.component.scss']
})
export class SelectSearchButtonComponent implements OnChanges {
	@Input()
	filters_all: Array<ISearchFilterDef>;
	@Input()
	filters_active: Array<ISearchFilterDef>;
	@Output()
	selectChange = new EventEmitter();
	showDialog = false;
	title: string;
	groups: Array<{
		name: string;
		filters: Array<{ active: boolean; isSearch: boolean; isFilter: boolean, filter: ISearchFilterDef, type: ISearchFilterDefType }>;
	}> = [];

	constructor(public i18n: I18NService) {
		this.title = i18n.get('Add Search Fields');
	}

	update(filter, isSearch): void {
		this.selectChange.emit({value: {isSearch: isSearch, filter: filter}});
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (!this.filters_all || !this.filters_active) {
			return;
		}
		let groups = {};
		this.filters_all.forEach(f => {
			let groupname = this.i18n.translateVariable(f.group || '_');
			groups[groupname] = groups[groupname] || {name: groupname, filters: []};
			groups[groupname].filters.push({
				active: this.filters_active.indexOf(f) >= 0,
				isSearch: isSearchDef(f),
				isFilter: isFilterDef(f),
				filter: f,
				type: ISearchFilterDefType[f.type]
			});
		});
		this.groups = Object.keys(groups).sort().map(key => groups[key]);
	}

}
