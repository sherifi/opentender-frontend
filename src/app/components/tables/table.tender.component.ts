import {Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {SearchCommand} from '../../model/search';
import {TenderColumns, TenderColumn, Table, ColumnSort} from '../../model/columns';
import {ISearchTenderData} from '../../app.interfaces';

/// <reference path="../../model/tender.d.ts" />
import Tender = Definitions.Tender;
import {NotifyService} from '../../services/notify.service';

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
	showDownloadDialog: boolean = false;

	total: number = 0;
	defaultPageSize: number = 10;
	defaultPage: number = 0;
	loading: number = 0;

	constructor(private api: ApiService, private notify: NotifyService) {
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

	download(format): void {

		if (this.total > 1000) {
			if (!this.showDownloadDialog) {
				this.showDownloadDialog = true;
				return;
			}
		}
		this.showDownloadDialog = false;

		let cmd = this.search_cmd;
		this.api.requestDownload(cmd).subscribe(
			(result) => {
				this.api.startDownload(result);
			},
			(error) => {
				this.notify.error(error);
			},
			() => {
			});
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

	sortChange(data: { value: ColumnSort }) {
		this.search_cmd.sort = {field: data.value.id, ascend: data.value.ascend};
		this.refresh();
	}

	refresh(): void {
		let cmd = this.search_cmd;
		this.loading++;
		this.api.searchTender(cmd).subscribe(
			(result) => {
				if (this.search_cmd === cmd) {
					this.display(result.data);
				}
			},
			(error) => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
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
