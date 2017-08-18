import {Component, Input, EventEmitter, Output} from '@angular/core';
import {FilterDef} from '../../model/filters';
import {I18NService} from '../../services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'select-search-button',
	templateUrl: 'select-search-button.component.html'
})
export class SelectSearchesButtonComponent {
	@Input()
	filters_all: Array<FilterDef>;
	@Input()
	filters_active: Array<FilterDef>;
	@Output()
	selectChange = new EventEmitter();
	showDialog = false;
	title: string;

	constructor(public i18n: I18NService) {
		this.title = i18n.get('Add Search Fields');
	}

	onSelectFilters(event) {
		this.selectChange.emit(event);
	}
}
