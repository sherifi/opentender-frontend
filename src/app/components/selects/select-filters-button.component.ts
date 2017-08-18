import {Component, Input, EventEmitter, Output} from '@angular/core';
import {FilterDef} from '../../model/filters';
import {I18NService} from '../../services/i18n.service';

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
	title: string;

	constructor(private i18n: I18NService) {
		this.title = i18n.get('Select Filter');
	}

	onSelectFilters(event) {
		this.selectChange.emit(event);
	}
}
