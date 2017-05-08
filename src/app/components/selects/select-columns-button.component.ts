import {Component, Input, EventEmitter, Output} from '@angular/core';
import {Column} from '../../model/columns';

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

	onSelectColumns(event) {
		this.selectChange.emit(event);
	}
}
