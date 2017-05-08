import {Component, Input, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {FilterDef} from '../../model/filters';

@Component({
	moduleId: __filename,
	selector: 'select-filters',
	templateUrl: 'select-filters.component.html'
})
export class SelectFiltersComponent implements OnChanges {
	@Input()
	filters_all: Array<FilterDef>;
	@Input()
	filters_active: Array<FilterDef>;
	@Input()
	mode: string;
	groups: Array<{name: string; columns: Array<{active: boolean; filter: FilterDef}> }> = [];
	@Output()
	selectChange = new EventEmitter();

	update(filter, active): void {
		this.selectChange.emit({value: {active: active, filter: filter}});
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (!this.filters_all || !this.filters_active) {
			return;
		}
		let groups = {};
		this.filters_all.forEach(filter => {
			let groupname = filter.group || '_';
			groups[groupname] = groups[groupname] || {name: groupname, filters: []};
			groups[groupname].filters.push({
				active: this.filters_active.indexOf(filter) >= 0,
				filter: filter
			});
		});
		this.groups = Object.keys(groups).sort().map(key => groups[key]);
	}

}
