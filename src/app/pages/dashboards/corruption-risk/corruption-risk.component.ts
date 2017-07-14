import {Component} from '@angular/core';
import {SearchCommand, SearchCommandFilter} from '../../../model/search';
import {ApiService} from '../../../services/api.service';
import {IStats} from '../../../app.interfaces';
import {Consts} from '../../../model/consts';
import {IChartBar, IChartPie} from '../../../thirdparty/ngx-charts-universal/chart.interface';
import {Utils} from '../../../model/utils';

@Component({
	moduleId: __filename,
	selector: 'corruption-risk',
	templateUrl: 'corruption-risk.template.html'
})
export class DashboardsCorruptionPage {
	public error: string;
	public search_cmd: SearchCommand;
	public columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name', 'indicators.cri'];
	vis: {
		sum_prices: Array<any>,
		buyers: Array<any>,
		suppliers: Array<any>,
		tenders_total: number,
		lots_total: number,
		bids_total: number,
		bids_awarded: number
	} = {
		sum_prices: [],
		buyers: [],
		suppliers: [],
		tenders_total: 0,
		lots_total: 0,
		bids_total: 0,
		bids_awarded: 0
	};

	private charts: {
		cpvs_codes_average: IChartBar;
		lots_pc_in_years: IChartBar;
		indicators: IChartPie;
	} = {
		cpvs_codes_average: {
			visible: false,
			chart: {
				schemeType: 'ordinal',
				view: {
					def: {width: 470, height: 716},
					min: {height: 716},
					max: {height: 716}
					},
				xAxis: {
					show: true,
					showLabel: true,
					label: 'Average %',
					defaultHeight: 20,
					tickFormatting: Utils.formatTrunc
				},
				yAxis: {
					show: true,
					showLabel: true,
					label: 'Sector (CPV Division)',
					defaultWidth: 130,
					maxLength: 20,
					tickFormatting: Utils.formatCPVName
				},
				valueFormatting: Utils.formatPercent,
				showGridLines: true,
				gradient: false,
				colorScheme: {
					domain: Consts.colors.diverging
				}
			},
			select: (event) => {
			},
			onLegendLabelClick: (event) => {
			},
			data: []
		},
		lots_pc_in_years: {
			visible: false,
			chart: {
				schemeType: 'ordinal',
				view: {
					def: {width: 470, height: 330},
					min: {height: 320},
					max: {height: 320}
				},
				xAxis: {
					show: true,
					showLabel: true,
					label: 'Year',
					defaultHeight: 20,
					tickFormatting: Utils.formatYear
				},
				yAxis: {
					show: true,
					showLabel: true,
					label: '% of Contracts',
					defaultWidth: 30,
					minInterval: 5,
					tickFormatting: Utils.formatTrunc
				},
				valueFormatting: Utils.formatPercent,
				showGridLines: true,
				gradient: false,
				colorScheme: {
					domain: Consts.colors.single
				}
			},
			select: (event) => {
			},
			onLegendLabelClick: (event) => {
			},
			data: []
		},
		indicators: {
			visible: false,
			chart: {
				schemeType: 'ordinal',
				view: {
					def: {width: 470, height: 320},
					min: {height: 320},
					max: {height: 320}
				},
				labels: true,
				explodeSlices: false,
				doughnut: false,
				gradient: false,
				valueFormatting: Utils.formatPercent,
				colorScheme: {
					domain: Consts.colors.diverging
				}
			},
			select: (event) => {
			},
			onLegendLabelClick: (event) => {
			},
			data: []
		}
	};

	private startYear: number = 0;
	private endYear: number = 0;

	private selectedStartYear: number = 0;
	private selectedEndYear: number = 0;

	constructor(private api: ApiService) {
	}

	ngOnInit(): void {
		this.visualize();
		this.search();
	}

	ngOnDestroy() {
	}

	display(stats: IStats): void {
		let vis = {
			sum_prices: [],
			buyers: [],
			suppliers: [],
			tenders_total: 0,
			lots_total: 0,
			bids_total: 0,
			bids_awarded: 0
		};
		let data = stats;
		if (!data) {
			this.vis = vis;
			return;
		}

		this.charts.indicators.data = [];
		if (data.indicators) {
			this.charts.indicators.data = Object.keys(data.indicators).map(key => {
				return {name: Utils.expandUnderlined(key.split('_').slice(1).join('_')), value: data.indicators[key]};
			});
		}
		this.charts.indicators.visible = this.charts.indicators.data.length > 0;

		this.charts.cpvs_codes_average.data = [];
		if (data.cpvs) {
			this.charts.cpvs_codes_average.data = Object.keys(data.cpvs).map(key => {
				return {name: data.cpvs[key].name, value: data.cpvs[key].percent};
			}).sort((a, b) => {
				return a.value - b.value;
			});
		}
		this.charts.cpvs_codes_average.visible = this.charts.cpvs_codes_average.data.length > 0;

		this.charts.lots_pc_in_years.data = [];
		if (data.lots_in_years) {
			this.charts.lots_pc_in_years.data = Object.keys(data.lots_pc_in_years).map((key) => {
				return {name: key, value: data.lots_pc_in_years[key].percent};
			});
		}
		this.charts.lots_pc_in_years.visible = this.charts.lots_pc_in_years.data.length > 0;

		if (data.sum_price) {
			Object.keys(data.sum_price).forEach(key => {
				if (data.sum_price[key] > 0) {
					vis.sum_prices.push({currency: key.toString().toUpperCase(), value: data.sum_price[key]});
				}
			});
		}
		if (data.suppliers) {
			vis.suppliers = data.suppliers.top10;
		}
		if (data.buyers) {
			vis.buyers = data.buyers.top10;
		}
		if (data.counts) {
			vis.bids_awarded = data.counts.bids_awarded;
			vis.bids_total = data.counts.bids;
			vis.lots_total = data.counts.lots;
			vis.tenders_total = data.counts.tenders;
		}
		this.vis = vis;

		if (this.startYear === 0) {
			if (data.lots_in_years) {
				Object.keys(data.lots_in_years).forEach((key) => {
					this.startYear = this.startYear == 0 ? parseInt(key, 10) : Math.min(parseInt(key, 10), this.startYear);
					this.endYear = this.endYear == 0 ? parseInt(key, 10) : Math.max(parseInt(key, 10), this.endYear);
				});
			}
		}
	}

	onSliderChange(event) {
		this.selectedStartYear = event.startValue;
		this.selectedEndYear = event.endValue;
		this.visualize();
		this.search();
	}

	visualize() {
		let filters = this.buildFilters();
		this.api.getIndicatorStats({filters: filters}).subscribe(
			(result) => this.display(result.data),
			(error) => {
				this.error = error._body;
				// console.error(error);
			},
			() => {
				// console.log('indicators complete');
			});
	}

	buildFilters() {
		let filter: SearchCommandFilter = {
			field: 'indicators.type',
			type: 'text',
			value: ['CORRUPTION'],
		};
		let filters = [filter];
		if (this.selectedStartYear > 0 && this.selectedEndYear > 0) {
			let yearFilter: SearchCommandFilter = {
				field: 'lots.awardDecisionDate',
				type: 'range',
				value: [this.selectedStartYear, this.selectedEndYear + 1],
			};
			filters.push(yearFilter);
		}
		return filters;
	}

	search() {
		let search_cmd = new SearchCommand();
		search_cmd.filters = this.buildFilters();
		this.search_cmd = search_cmd;
	}

	searchChange(data) {
	}
}
