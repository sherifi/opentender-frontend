import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ITable, ITableColumn} from '../../app.interfaces';

@Component({
	selector: 'doc-table',
	templateUrl: 'table.component.html',
	styleUrls: ['table.component.scss']
})
export class TableComponent {
	@Input()
	table: ITable;
	@Output()
	sortChange = new EventEmitter();

	constructor() {
	}

	setSort(col: ITableColumn): void {
		if (col.sortBy) {
			if (this.table.sortBy && this.table.sortBy.id === col.sortBy.id) {
				this.sortChange.emit({
					value: {
						id: col.sortBy.id,
						ascend: !this.table.sortBy.ascend
					}
				});
			} else {
				this.sortChange.emit({
					value: {
						id: col.sortBy.id,
						ascend: col.sortBy.ascend
					}
				});
			}
		}
	}
}
