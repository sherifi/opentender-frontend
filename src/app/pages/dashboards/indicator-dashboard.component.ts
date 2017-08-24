import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {SearchCommand, SearchCommandFilter} from '../../model/search';
import {ApiService} from '../../services/api.service';
import {IStats, IStatsPcCpvs, IStatsIndicators, IStatsCompanies, IStatsAuthorities, IStatsPcPricesLotsInYears, IndicatorInfo} from '../../app.interfaces';
import {I18NService} from '../../services/i18n.service';
import {Utils} from '../../model/utils';
import {NotifyService} from '../../services/notify.service';

@Component({
	moduleId: __filename,
	selector: 'indicator-dashboard',
	templateUrl: 'indicator-dashboard.template.html'
})
export class DashboardsIndicatorComponent implements OnChanges {
	@Input()
	indicator: IndicatorInfo;
	@Input()
	columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name'];

	private title: string = '';
	private searchPrefix: string = '';
	private indicatorTitle: string;
	private columnTitle: string;
	private loading: number = 0;
	private selected: string = 'all';
	private search_cmd: SearchCommand;
	private viz: {
		top_companies: { absolute: IStatsCompanies, volume: IStatsCompanies },
		top_authorities: { absolute: IStatsAuthorities, volume: IStatsAuthorities },
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
			isSet: boolean;
			startYear: number;
			endYear: number;
			selectedStartYear: number;
			selectedEndYear: number;
		}
	} = {
		time: {
			isSet: false,
			startYear: null,
			endYear: null,
			selectedStartYear: null,
			selectedEndYear: null
		}
	};

	constructor(private api: ApiService, private i18n: I18NService, private notify: NotifyService) {
		this.columnTitle = i18n.get('Tenders');
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.title = this.i18n.get(this.indicator.plural);
		this.indicatorTitle = this.i18n.get(this.indicator.plural);
		this.searchPrefix = this.indicator.prefix;
	}

	ngOnInit(): void {
		this.visualize();
		this.search();
	}

	ngOnDestroy() {
	}

	selectChange(event) {
		this.displayIndicator();
	}

	displayIndicator() {
		if (this.selected == 'all') {
			this.indicatorTitle = this.i18n.get(this.indicator.plural);
			this.searchPrefix = this.indicator.prefix;
		} else {
			this.searchPrefix = this.selected;
			this.indicatorTitle = this.i18n.get(Utils.formatIndicatorName(this.selected)) + ' ' + this.i18n.get('Indicator');
		}
		this.visualize();
		this.search();
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
		viz.top_companies = {absolute: stats.top_terms_companies, volume: stats.top_sum_finalPrice_companies};
		viz.top_authorities = {absolute: stats.top_terms_authorities, volume: stats.top_sum_finalPrice_authorities};

		this.viz = viz;

		if (!this.filter.time.isSet && stats.histogram_pc_lots_awardDecisionDate_finalPrices) {
			let startYear = 0;
			let endYear = 0;
			Object.keys(stats.histogram_pc_lots_awardDecisionDate_finalPrices).forEach((key) => {
				let year = parseInt(key, 10);
				startYear = startYear == 0 ? year : Math.min(year, startYear);
				endYear = endYear == 0 ? year : Math.max(year, endYear);
			});
			this.filter.time = {
				isSet: true,
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
		this.loading++;
		this.api.getIndicatorStats({filters: filters}).subscribe(
			(result) => {
				this.display(result.data)
			},
			(error) => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
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
