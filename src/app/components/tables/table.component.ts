import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Table, Column} from '../../model/columns';

@Component({
	selector: 'doc-table',
	templateUrl: 'table.template.html'
})
export class TableComponent {
	@Input()
	table: Table;
	@Output()
	sortChange = new EventEmitter();

	constructor() {
	}

	setSort(col: Column): void {
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
