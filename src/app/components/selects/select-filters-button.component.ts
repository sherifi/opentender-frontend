import {Component, Input, EventEmitter, Output} from '@angular/core';
import {FilterDef} from '../../model/filters';

@Component({
	moduleId: __filename,
	selector: 'select-filters-button',
	templateUrl: 'select-filters-button.component.html'
})
export class SelectFiltersButtonComponent {
	@Input()
	filters_all: Array<FilterDef>;
	@Input()
	filters_active: Array<FilterDef>;
	@Output()
	selectChange = new EventEmitter();
	showDialog = false;

	onSelectFilters(event) {
		this.selectChange.emit(event);
	}
}
