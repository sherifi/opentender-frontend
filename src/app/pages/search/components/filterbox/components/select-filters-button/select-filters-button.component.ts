import {Component, Input, EventEmitter, Output} from '@angular/core';
import {ISearchFilterDef} from '../../../../../../app.interfaces';
import {I18NService} from '../../../../../../modules/i18n/services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'select-filters-button',
	templateUrl: 'select-filters-button.component.html',
	styleUrls: ['select-filters-button.component.scss']
})
export class SelectFiltersButtonComponent {
	@Input()
	filters_all: Array<ISearchFilterDef>;
	@Input()
	filters_active: Array<ISearchFilterDef>;
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
