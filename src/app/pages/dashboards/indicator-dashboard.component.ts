import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {I18NService} from '../../services/i18n.service';
import {Utils} from '../../model/utils';
import {NotifyService} from '../../services/notify.service';
import {
	ISearchCommandFilter, IStats, IStatsPcCpvs, IStatsIndicators, IStatsCompanies, IStatsAuthorities, IStatsPcPricesLotsInYears,
	IIndicatorInfo, ISubIndicatorInfo, ISearchCommand, IStatsInYears, IStatsCpvs
} from '../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'indicator-dashboard',
	templateUrl: 'indicator-dashboard.template.html'
})
export class DashboardsIndicatorComponent implements OnChanges {
	@Input()
	indicator: IIndicatorInfo;
	@Input()
	columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name'];

	private icon: string = '';
	private searchPrefix: string = '';
	private searchScore: [number, number] = [0, 0.5];
	public title: string = '';
	public subindicators: ISubIndicatorInfo[] = [];
	public selected: ISubIndicatorInfo = null;
	public search_cmd: ISearchCommand;
	public indicatorTitle: string;
	public loading: number = 0;
	public viz: {
		top_companies: { absolute: IStatsCompanies, volume: IStatsCompanies },
		top_authorities: { absolute: IStatsAuthorities, volume: IStatsAuthorities },
		score_in_years: IStatsInYears,
		lots_in_years: IStatsPcPricesLotsInYears,
		cpvs_codes: IStatsPcCpvs
		terms_indicators_score: IStatsIndicators,
		score_in_sectors: IStatsCpvs
	} = {
		top_companies: null,
		top_authorities: null,
		score_in_years: null,
		lots_in_years: null,
		cpvs_codes: null,
		score_in_sectors: null,
		terms_indicators_score: null
	};
	public filter: {
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
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.title = this.i18n.get(this.indicator.plural);
		this.indicatorTitle = this.i18n.get(this.indicator.plural);
		this.searchPrefix = this.indicator.id;
		this.icon = this.indicator.icon;
		this.subindicators = Utils.subindicators(this.indicator.id);
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

	selectIndicatorChange(event) {
		this.selected = this.subindicators.find(sub => sub.id === event.id);
		this.displayIndicator();
	}

	displayIndicator() {
		if (!this.selected) {
			this.indicatorTitle = this.i18n.get(this.indicator.plural);
			this.searchPrefix = this.indicator.id;
		} else {
			this.searchPrefix = this.selected.id;
			this.indicatorTitle = this.i18n.get(this.selected.name) + ' ' + this.i18n.get('Indicator');
		}
		this.visualize();
		this.search();
	}

	private displayStats(stats: IStats): void {
		let viz = {
			top_companies: null,
			top_authorities: null,
			lots_in_years: null,
			score_in_years: null,
			cpvs_codes: null,
			score_in_sectors: null,
			terms_indicators_score: null
		};
		if (!stats) {
			this.viz = viz;
			return;
		}

		viz.score_in_sectors = stats.terms_main_cpv_divisions_score;
		viz.score_in_years = (stats.histogram_lots_awardDecisionDate_scores ? stats.histogram_lots_awardDecisionDate_scores[this.searchPrefix] : {}) || {};
		viz.lots_in_years = stats.histogram_pc_lots_awardDecisionDate_finalPrices;
		viz.cpvs_codes = stats.terms_pc_main_cpv_divisions;
		viz.terms_indicators_score = stats.terms_indicators_score;
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

	onScoreSliderChange(event) {
		this.searchScore = [event.startValue / 10, event.endValue / 10];
		this.visualize();
		this.search();
	}

	formatScoreTick(value) {
		return value / 10;
	}

	onYearRangeSliderChange(event) {
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
				this.displayStats(result.data);
			},
			(error) => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
			});
	}

	buildFilters() {
		let filter: ISearchCommandFilter;
		if (!this.selected) {
			filter = {
				field: 'scores.type',
				type: 'term',
				value: [this.searchPrefix],
				and: [{
					field: 'scores.value',
					type: 'range',
					value: this.searchScore
				}]
			};
		} else {
			filter = {
				field: 'indicators.type',
				type: 'term',
				value: [this.searchPrefix],
				and: [{
					field: 'indicators.value',
					type: 'range',
					value: this.searchScore
				}]
			};
		}
		let filters = [filter];
		if (this.filter.time && this.filter.time.selectedStartYear > 0 && this.filter.time.selectedEndYear > 0 &&
			(this.filter.time.selectedStartYear !== this.filter.time.startYear || this.filter.time.selectedEndYear !== this.filter.time.endYear)
		) {
			let yearFilter: ISearchCommandFilter = {
				field: 'lots.awardDecisionDate',
				type: 'years',
				value: [this.filter.time.selectedStartYear, this.filter.time.selectedEndYear + 1],
			};
			filters.push(yearFilter);
		}
		return filters;
	}

	search() {
		this.search_cmd = {
			filters: this.buildFilters()
		};
	}

	searchChange(data) {
	}
}
