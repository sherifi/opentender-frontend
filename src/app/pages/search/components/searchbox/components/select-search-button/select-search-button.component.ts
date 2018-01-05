import {Component, Input, EventEmitter, Output} from '@angular/core';
import {ISearchFilterDef} from '../../../../../../app.interfaces';
import {I18NService} from '../../../../../../modules/i18n/services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'select-search-button',
	templateUrl: 'select-search-button.component.html'
})
export class SelectSearchesButtonComponent {
	@Input()
	filters_all: Array<ISearchFilterDef>;
	@Input()
	filters_active: Array<ISearchFilterDef>;
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
