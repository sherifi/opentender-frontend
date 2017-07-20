import {Component, Input} from '@angular/core';
import {SearchCommand, SearchCommandFilter} from '../../model/search';
import {ApiService} from '../../services/api.service';
import {IStats, IStatsCpvs, IStatsIndicators, IStatsLotsInYears} from '../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'indicator-dashboard',
	templateUrl: 'indicator-dashboard.template.html'
})
export class DashboardsIndicatorComponent {
	@Input()
	indicator: string = 'Indicators';
	@Input()
	searchPrefix: string = '';
	@Input()
	columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name'];

	public error: string;
	public search_cmd: SearchCommand;
	vis: {
		sum_prices: Array<any>,
		buyers: Array<any>,
		suppliers: Array<any>,
		tenders_total: number,
		lots_total: number,
		bids_total: number,
		bids_awarded: number,
		lots_in_years: IStatsLotsInYears,
		cpvs_codes: IStatsCpvs
		indicators: IStatsIndicators
	} = {
		sum_prices: [],
		buyers: [],
		suppliers: [],
		tenders_total: 0,
		lots_total: 0,
		bids_total: 0,
		bids_awarded: 0,
		lots_in_years: null,
		cpvs_codes: null,
		indicators: null
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
			bids_awarded: 0,
			lots_in_years: null,
			cpvs_codes: null,
			indicators: null
		};
		let data = stats;
		if (!data) {
			this.vis = vis;
			return;
		}

		vis.lots_in_years = data.lots_pc_in_years;
		vis.cpvs_codes = data.cpvs;
		vis.indicators = data.indicators;

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
			value: [this.searchPrefix]
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
