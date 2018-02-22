/// <reference path="../../../model/tender.d.ts" />
import Tender = Definitions.Tender;
import {Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {TenderColumns} from '../../../model/columns';
import {NotifyService} from '../../../services/notify.service';
import {I18NService} from '../../i18n/services/i18n.service';
import {PlatformService} from '../../../services/platform.service';
import {Utils} from '../../../model/utils';
import {ISearchResultTender, ISearchCommand, ITableColumnTender, ITable, ITableColumnSort, ITableLibrary, ISearchCommandWeights} from '../../../app.interfaces';
import {IndicatorService} from '../../../services/indicator.service';
import Score = Definitions.Score;
import Indicator = Definitions.Indicator;

@Component({
	selector: 'tender-table',
	templateUrl: 'table-tender.component.html',
	styleUrls: ['table-tender.component.html']
})
export class TenderTableComponent implements OnChanges, OnInit {
	@Input()
	search_cmd: ISearchCommand;
	@Input()
	columnIds: Array<string>;
	@Output()
	searchChange = new EventEmitter();
	@Output()
	columnsChange = new EventEmitter();

	columns: Array<ITableColumnTender> = [];
	all_columns = TenderColumns;

	tenders: Array<Tender> = [];
	table: ITable;
	sortBy: ITableColumnSort;
	showDownloadDialog: boolean = false;
	downloadRequested: boolean = false;

	title: string;
	total: number = 0;
	defaultPageSize: number = 10;
	defaultPage: number = 0;
	loading: number = 0;

	constructor(private api: ApiService, private notify: NotifyService, private platform: PlatformService, private i18n: I18NService, private indicators: IndicatorService) {
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

	showDownload(): void {
		if (this.total > 0) {
			this.showDownloadDialog = true;
		}
	}

	download(format: string): void {
		this.downloadRequested = true;
		let cmd = this.search_cmd;
		let sub = this.api.requestDownload(format, cmd).subscribe(
			(result) => {
				this.downloadRequested = false;
				if (this.showDownloadDialog) {
					this.api.startDownload(result);
				}
				this.showDownloadDialog = false;
			},
			(error) => {
				this.downloadRequested = false;
				this.showDownloadDialog = false;
				this.notify.error(error);
			},
			() => {
				sub.unsubscribe();
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
		this.columnsChange.emit({columns: this.columns.map(column => column.id)});
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


	recalculateScore(score: Score, indicators: Array<Indicator>, weights: ISearchCommandWeights) {
		let sum = 0;
		let count = 0;
		indicators.forEach(indicator => {
			if (indicator.status === 'CALCULATED' && indicator.type.indexOf(score.type) === 0) {
				let weight = weights[indicator.type];
				if (!isNaN(weight)) {
					sum += (indicator.value * weight);
					count += weight;
				}
			}
		});
		if (count > 0) {
			score.value = Utils.roundValueTwoDecimals(sum / count);
			score.status = 'CALCULATED';
		} else {
			score.value = undefined;
			score.status = 'INSUFFICIENT_DATA';
		}
	}

	recalculateTenderScore(score: Score, scores: Array<Score>) {
		let sum = 0;
		let count = 0;
		scores.forEach(s => {
			if (s.type !== score.type && s.status === 'CALCULATED') {
				sum += s.value;
				count++;
			}
		});
		if (count > 0) {
			score.value = Utils.roundValueTwoDecimals(sum / count);
			score.status = 'CALCULATED';
		} else {
			score.value = undefined;
			score.status = 'INSUFFICIENT_DATA';
		}
	}

	refresh(scrollToTop: boolean = false): void {
		let cmd = this.search_cmd;
		this.loading++;
		let sub = this.api.searchTender(cmd).subscribe(
			(result) => {
				if (this.search_cmd === cmd) {
					let weightsfilter = cmd.filters.find(c => !!c.weights);
					if (weightsfilter && result && result.data && result.data.hits && result.data.hits.hits) {
						result.data.hits.hits.forEach(hit => {
							let score = hit.ot.scores.find(s => s.type === weightsfilter.field);
							if (score) {
								this.recalculateScore(score, hit.indicators, weightsfilter.weights);
								let tenderscore = hit.ot.scores.find(s => s.type === this.indicators.TENDER.id);
								if (tenderscore) {
									this.recalculateTenderScore(tenderscore, hit.ot.scores);
								}
							}
						});
					}
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
				sub.unsubscribe();
			});
	}

	buildTable(): void {
		let library: ITableLibrary = {
			indicators: this.indicators.GROUPS,
			TENDER: this.indicators.TENDER,
			i18n: this.i18n
		};
		let table: ITable = {
			columns: this.columns,
			sortBy: this.sortBy,
			rows: []
		};
		if (this.tenders) {
			this.tenders.forEach(tender => {
				let row = [];
				this.columns.forEach(col => {
					row.push({lines: col.format(tender, library)});
				});
				table.rows.push({cells: row});
			});
		}
		this.table = table;
	}

	setTableTitle(total?) {
		this.title = this.i18n.get('Tenders') + (total !== null ? ': ' + this.i18n.formatValue(total) : '');
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
