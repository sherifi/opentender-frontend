import {Component} from '@angular/core';
import {SearchCommand, SearchCommandFilter} from '../../../model/search';
import {ApiService} from '../../../services/api.service';
import {IStats} from '../../../app.interfaces';
import {Consts} from '../../../model/consts';
import {IChartBar, IChartPie} from '../../../thirdparty/ngx-charts-universal/chart.interface';
import {Utils} from '../../../model/utils';

@Component({
	moduleId: __filename,
	selector: 'corruption',
	templateUrl: 'corruption.template.html'
})
export class ExploreCorruptionPage {
	public error: string;
	public search_cmd: SearchCommand;
	public columnIds = ['id', 'title', 'titleEnglish', 'buyers.name', 'lots.bids.bidders', 'indicators', 'lots.awardDecisionDate'];
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
		lots_in_years: IChartBar;
		cpvs_codes: IChartPie;
	} = {
		lots_in_years: {
			visible: false,
			chart: {
				schemeType: 'ordinal',
				view: {
					def: {width: 470, height: 320},
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
					label: 'Number of Lots',
					defaultWidth: 30,
					minInterval: 1,
					tickFormatting: Utils.formatValue
				},
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
		cpvs_codes: {
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
		let data = stats; // .corruption_indicators;
		if (!data) {
			this.vis = vis;
			return;
		}

		this.charts.cpvs_codes.data = [];
		if (data.cpvs) {
			this.charts.cpvs_codes.data = Object.keys(data.cpvs).map(key => {
				return {name: data.cpvs[key].name, value: data.cpvs[key].value};
			});
		}
		this.charts.cpvs_codes.visible = this.charts.cpvs_codes.data.length > 0;

		this.charts.lots_in_years.data = [];
		if (data.lots_in_years) {
			this.charts.lots_in_years.data = Object.keys(data.lots_in_years).map((key, index) => {
				return {name: key, value: data.lots_in_years[key]};
			});
		}
		this.charts.lots_in_years.visible = this.charts.lots_in_years.data.length > 0;

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
				// console.log('corruption_indicators complete');
			});
	}

	buildFilters() {
		let filter: SearchCommandFilter = {
			field: 'indicators.type',
			type: 'match',
			value: ['CORRUPTION_SINGLE_BID'],
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
	};

	searchChange(data) {
	}
}
