import {Component, Input, EventEmitter, Output} from '@angular/core';
import {Column} from '../../model/columns';
import {I18NService} from '../../services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'select-columns-button',
	templateUrl: 'select-columns-button.component.html'
})
export class SelectColumnsButtonComponent {
	@Input()
	columns_all: Array<Column>;
	@Input()
	columns_active: Array<Column>;
	@Output()
	selectChange = new EventEmitter();
	showDialog = false;
	title: string;

	constructor(private i18n: I18NService) {
		this.title = i18n.get('Select Column');
	}

	onSelectColumns(event) {
		this.selectChange.emit(event);
	}
}
