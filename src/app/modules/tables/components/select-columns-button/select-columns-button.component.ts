import {Component, Input, EventEmitter, Output} from '@angular/core';
import {I18NService} from '../../../i18n/services/i18n.service';
import {ITableColumn} from '../../../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'select-columns-button',
	templateUrl: 'select-columns-button.component.html',
	styleUrls: ['select-columns-button.component.scss']
})
export class SelectColumnsButtonComponent {
	@Input()
	columns_all: Array<ITableColumn>;
	@Input()
	columns_active: Array<ITableColumn>;
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
