import {Component, Input} from '@angular/core';
import {SearchCommand, SearchCommandFilter} from '../../model/search';
import {ApiService} from '../../services/api.service';
import {IStats, IStatsPcCpvs, IStatsIndicators, IStatsPcLotsInYears} from '../../app.interfaces';

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
		lots_in_years: IStatsPcLotsInYears,
		cpvs_codes: IStatsPcCpvs
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

		vis.lots_in_years = data.histogram_pc_lots_awardDecisionDate;
		vis.cpvs_codes = data.terms_pc_main_cpv_divisions;
		vis.indicators = data.terms_indicators;

		if (data.sums_finalPrice) {
			Object.keys(data.sums_finalPrice).forEach(key => {
				if (data.sums_finalPrice[key] > 0) {
					vis.sum_prices.push({currency: key.toString().toUpperCase(), value: data.sums_finalPrice[key]});
				}
			});
		}
		if (data.top_companies) {
			vis.suppliers = data.top_companies.top10;
		}
		if (data.top_authorities) {
			vis.buyers = data.top_authorities.top10;
		}
		if (data.count_lots_bids) {
			vis.bids_awarded = data.count_lots_bids.bids_awarded;
			vis.bids_total = data.count_lots_bids.bids;
			vis.lots_total = data.count_lots_bids.lots;
			vis.tenders_total = data.count_lots_bids.tenders;
		}
		this.vis = vis;

		if (this.startYear === 0) {
			if (data.histogram_pc_lots_awardDecisionDate) {
				Object.keys(data.histogram_pc_lots_awardDecisionDate).forEach((key) => {
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
