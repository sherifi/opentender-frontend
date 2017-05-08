import {Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {SearchCommand} from '../../model/search';
import {CompanyColumns, CompanyColumn, Table, ColumnSort} from '../../model/columns';
import {ICompany, ISearchCompanyData} from '../../app.interfaces';

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

	isLoading = false;
	total = 0;
	defaultPageSize = 10;
	defaultPage = 0;

	constructor(private api: ApiService) {
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
			name: 'Company',
			columns: this.columns,
			sortBy: this.sortBy,
			rows: []
		};
		if (this.companies) {
			// let companies = this.companies.slice(this.pagination.from, this.pagination.from + this.pagination.size);
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
		// this.pagination.from = (data.value.page || 0) * parseInt(data.value.pageSize, 10);
		// this.pagination.size = data.value.pageSize;
		// this.buildTable();
		// this.refresh();
	}

	refresh(): void {
		let cmd = this.search_cmd;
		this.isLoading = true;
		this.api.searchCompany(cmd).subscribe(
			(result) => {
				if (this.search_cmd === cmd) {
					this.isLoading = false;
					this.display(result.data);
				}
			},
			(error) => {
				this.isLoading = false;
				console.error(error);
			},
			() => {
				this.isLoading = false;
				// console.log('searchCompany complete');
			});
	}

	display(data: ISearchCompanyData): void {
		if (data) {
			this.total = data.hits.total;
			this.companies = data.hits.hits;
			this.buildTable();
			this.searchChange.emit(data);
		}
	}

}
