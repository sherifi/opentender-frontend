/// <reference path="../../model/tender.d.ts" />
import Tender = Definitions.Tender;
import {Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {TenderColumns} from '../../model/columns';
import {NotifyService} from '../../services/notify.service';
import {I18NService} from '../../services/i18n.service';
import {PlatformService} from '../../services/platform.service';
import {Utils} from '../../model/utils';
import {ISearchResultTender, ISearchCommand, ITableColumnTender, ITable, ITableColumnSort} from '../../app.interfaces';

@Component({
	selector: 'tender-table',
	templateUrl: 'table.tender.template.html'
})
export class TenderTableComponent implements OnChanges, OnInit {
	@Input()
	search_cmd: ISearchCommand;
	@Input()
	columnIds: Array<string>;
	@Output()
	searchChange = new EventEmitter();

	columns: Array<ITableColumnTender> = [];
	all_columns = TenderColumns;

	tenders: Array<Tender> = [];
	table: ITable;
	sortBy: ITableColumnSort;
	showDownloadDialog: boolean = false;

	title: string;
	total: number = 0;
	defaultPageSize: number = 10;
	defaultPage: number = 0;
	loading: number = 0;

	constructor(private api: ApiService, private notify: NotifyService, private i18n: I18NService, private platform: PlatformService) {
		this.setTableTitle();
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

	download(): void {
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

	onSelectColumns(event: { value: Array<ITableColumnTender> }): void {
		this.columns = event.value;
		this.buildTable();
	}

	paginationChange(data): void {
		this.search_cmd.from = (data.value.page || 0) * parseInt(data.value.pageSize, 10);
		this.search_cmd.size = data.value.pageSize;
		this.refresh(true);
	}

	sortChange(data: { value: ITableColumnSort }) {
		this.search_cmd.sort = {field: data.value.id, ascend: data.value.ascend};
		this.refresh();
	}

	refresh(scrollToTop: boolean = false): void {
		let cmd = this.search_cmd;
		this.loading++;
		this.api.searchTender(cmd).subscribe(
			(result) => {
				if (this.search_cmd === cmd) {
					this.display(result.data);
					if (scrollToTop && this.platform.isBrowser) {
						Utils.scrollToFirst('tables');
					}
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
		let table: ITable = {
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
	}

	setTableTitle(total?) {
		this.title = this.i18n.get('Tenders') + (total !== null ? ': ' + Utils.formatValue(total) : '');
	}

	display(data: ISearchResultTender): void {
		if (data) {
			this.setTableTitle(data.hits && data.hits.total ? data.hits.total : 0);
			this.total = data.hits.total;
			this.sortBy = data.sortBy;
			this.tenders = data.hits.hits;
			this.buildTable();
			this.searchChange.emit(data);
		}
	}

}
