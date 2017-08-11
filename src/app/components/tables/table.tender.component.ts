import {Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {SearchCommand} from '../../model/search';
import {TenderColumns, TenderColumn, Table, ColumnSort} from '../../model/columns';
import {ISearchTenderData} from '../../app.interfaces';

/// <reference path="../../model/tender.d.ts" />
import Tender = Definitions.Tender;

@Component({
	selector: 'tender-table',
	templateUrl: 'table.tender.template.html'
})
export class TenderTableComponent implements OnChanges, OnInit {
	@Input()
	search_cmd: SearchCommand;
	@Input()
	columnIds: Array<string>;
	@Input()
	title: string;
	@Output()
	searchChange = new EventEmitter();

	columns: Array<TenderColumn> = [];
	all_columns = TenderColumns;

	tenders: Array<Tender> = [];
	table: Table;
	sortBy: ColumnSort;

	total = 0;
	defaultPageSize = 10;
	defaultPage = 0;
	isLoading = false;

	constructor(private api: ApiService) {
	}

	ngOnInit(): void {
		if (this.columnIds) {
			this.setColumnsByIds();
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['search_cmd'] && changes['search_cmd'].currentValue) {
			this.defaultPageSize = this.search_cmd.size || 10;
			this.defaultPage = Math.round((this.search_cmd.from || 0) / this.defaultPageSize);
			this.refresh();
		} else if (changes['columnIds'] && changes['columnIds'].currentValue) {
			this.setColumnsByIds();
		}
	}

	setColumnsByIds(): void {
		this.columns = [];
		this.columnIds.forEach(c => {
			this.all_columns.forEach(col => {
				if (c == col.id) {
					this.columns.push(col);
				}
			});
		});
		this.buildTable();
	}

	onSelectColumns(event) {
		this.columns = event.value;
		this.buildTable();
	}

	paginationChange(data): void {
		this.search_cmd.from = (data.value.page || 0) * parseInt(data.value.pageSize, 10);
		this.search_cmd.size = data.value.pageSize;
		this.refresh();
	}

	sortChange(data: {value: ColumnSort}) {
		this.search_cmd.sort = {field: data.value.id, ascend: data.value.ascend};
		this.refresh();
	}

	refresh(): void {
		let cmd = this.search_cmd;
		this.isLoading = true;
		this.api.searchTender(cmd).subscribe(
			(result) => {
				if (this.search_cmd === cmd) {
					this.isLoading = false;
					this.display(result.data);
				}
			},
			error => {
				this.isLoading = false;
				console.error(error);
			},
			() => {
				this.isLoading = false;
				// console.log('searchTender complete');
			});
	}

	buildTable(): void {
		let table: Table = {
			name: 'Tender',
			columns: this.columns,
			sortBy: this.sortBy,
			rows: []
		};
		if (this.tenders) {
			this.tenders.forEach(tender => {
				let row = [];
				this.columns.forEach(col => {
					row.push({lines: col.format(tender)});
				});
				table.rows.push({cells: row});
			});
		}
		this.table = table;
	};


	display(data: ISearchTenderData): void {
		if (data) {
			this.total = data.hits.total;
			this.sortBy = data.sortBy;
			this.tenders = data.hits.hits;
			this.buildTable();
			this.searchChange.emit(data);
		}
	}

}
