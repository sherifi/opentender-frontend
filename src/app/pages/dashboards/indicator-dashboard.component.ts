import {Component, Input} from '@angular/core';
import {SearchCommand, SearchCommandFilter} from '../../model/search';
import {ApiService} from '../../services/api.service';
import {IStats, IStatsPcCpvs, IStatsIndicators, IStatsCompanies, IStatsAuthorities, IStatsPcPricesLotsInYears} from '../../app.interfaces';

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

	private error: string;
	private search_cmd: SearchCommand;
	private viz: {
		top_companies: IStatsCompanies,
		top_authorities: IStatsAuthorities,
		lots_in_years: IStatsPcPricesLotsInYears,
		cpvs_codes: IStatsPcCpvs
		terms_indicators: IStatsIndicators
	} = {
		top_companies: null,
		top_authorities: null,
		lots_in_years: null,
		cpvs_codes: null,
		terms_indicators: null
	};
	private filter: {
		time?: {
			startYear: number;
			endYear: number;
			selectedStartYear: number;
			selectedEndYear: number;
		}
	} = {
		time: null
	};

	constructor(private api: ApiService) {
	}

	ngOnInit(): void {
		this.visualize();
		this.search();
	}

	ngOnDestroy() {
	}

	display(stats: IStats): void {
		let viz = {
			top_companies: null,
			top_authorities: null,
			lots_in_years: null,
			cpvs_codes: null,
			terms_indicators: null
		};
		if (!stats) {
			this.viz = viz;
			return;
		}

		viz.lots_in_years = stats.histogram_pc_lots_awardDecisionDate_finalPrices;
		viz.cpvs_codes = stats.terms_pc_main_cpv_divisions;
		viz.terms_indicators = stats.terms_indicators;
		viz.top_companies = stats.top_companies;
		viz.top_authorities = stats.top_authorities;

		this.viz = viz;

		if (!this.filter.time && stats.histogram_pc_lots_awardDecisionDate_finalPrices) {
			let startYear = 0;
			let endYear = 0;
			Object.keys(stats.histogram_pc_lots_awardDecisionDate_finalPrices).forEach((key) => {
				let year = parseInt(key, 10);
				startYear = startYear == 0 ? year : Math.min(year, startYear);
				endYear = endYear == 0 ? year : Math.max(year, endYear);
			});
			this.filter.time = {
				startYear, endYear,
				selectedStartYear: startYear,
				selectedEndYear: endYear
			};
		}
	}

	onSliderChange(event) {
		if (!this.filter.time) {
			return;
		}
		this.filter.time.selectedStartYear = event.startValue;
		this.filter.time.selectedEndYear = event.endValue;
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
		if (this.filter.time && this.filter.time.selectedStartYear > 0 && this.filter.time.selectedEndYear > 0) {
			let yearFilter: SearchCommandFilter = {
				field: 'lots.awardDecisionDate',
				type: 'range',
				value: [this.filter.time.selectedStartYear, this.filter.time.selectedEndYear + 1],
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
