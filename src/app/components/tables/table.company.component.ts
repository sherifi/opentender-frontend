import {Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {SearchCommand} from '../../model/search';
import {CompanyColumns, CompanyColumn, Table, ColumnSort} from '../../model/columns';
import {ICompany, ISearchCompanyData} from '../../app.interfaces';
import {NotifyService} from '../../services/notify.service';

@Component({
	selector: 'company-table',
	templateUrl: 'table.company.template.html'
})
export class CompanyTableComponent implements OnChanges, OnInit {
	@Input()
	search_cmd: SearchCommand;
	@Input()
	columnIds: Array<string>;
	@Input()
	title: string;
	@Output()
	searchChange = new EventEmitter();

	columns: Array<CompanyColumn> = [];
	all_columns = CompanyColumns;

	table: Table;
	sortBy: ColumnSort;
	companies: Array<ICompany> = [];

	loading: number = 0;
	total: number = 0;
	defaultPageSize: number = 10;
	defaultPage: number = 0;

	constructor(private api: ApiService, private notify: NotifyService) {
	}

	ngOnInit(): void {
		if (this.columnIds) {
			this.setColumns();
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['search_cmd'] && changes['search_cmd'].currentValue) {
			this.defaultPageSize = this.search_cmd.size || 10;
			this.defaultPage = Math.round((this.search_cmd.from || 0) / this.defaultPageSize);
			this.refresh();
		} else if (changes['columnIds'] && changes['columnIds'].currentValue) {
			this.setColumns();
		}
	}

	setColumns(): void {
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

	buildTable(): void {
		let table: Table = {
			columns: this.columns,
			sortBy: this.sortBy,
			rows: []
		};
		if (this.companies) {
			this.companies.forEach(company => {
				let row = [];
				this.columns.forEach(col => {
					row.push({lines: col.format(company)});
				});
				table.rows.push({cells: row});
			});
		}
		this.table = table;
	};

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
		this.api.searchCompany(cmd).subscribe(
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

	display(data: ISearchCompanyData): void {
		if (data) {
			this.total = data.hits.total;
			this.sortBy = data.sortBy;
			this.companies = data.hits.hits;
			this.buildTable();
			this.searchChange.emit(data);
		}
	}

}
