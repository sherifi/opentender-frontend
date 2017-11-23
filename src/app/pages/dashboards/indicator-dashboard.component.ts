import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {I18NService} from '../../services/i18n.service';
import {Utils} from '../../model/utils';
import {NotifyService} from '../../services/notify.service';
import {
	ISearchCommandFilter, IStats, IStatsPcCpvs, IStatsIndicators, IStatsCompanies, IStatsAuthorities, IStatsPcPricesLotsInYears,
	IIndicatorInfo, ISubIndicatorInfo, ISearchCommand, IStatsInYears, IStatsCpvs
} from '../../app.interfaces';
import {IChartData} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {Consts} from '../../model/consts';

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
	private searchScore: [number, number] = [0, 50];
	public title: string = '';
	public subindicators: ISubIndicatorInfo[] = [];
	public selected: ISubIndicatorInfo = null;
	public search_cmd: ISearchCommand;
	public indicatorTitle: string;
	public loading: number = 0;
	public viz: {
		top_companies: { data: { absolute: IStatsCompanies, volume: IStatsCompanies }, title?: string };
		top_authorities: { data: { absolute: IStatsAuthorities, volume: IStatsAuthorities }, title?: string };
		score_in_years: { data: IStatsInYears, title?: string };
		score_in_sectors: { data: IStatsCpvs, title?: string };
		lots_in_years: { data: IStatsPcPricesLotsInYears, title?: string };
		cpvs_codes: { data: IStatsPcCpvs, title?: string };
		terms_indicators_score: { data: IStatsIndicators, title?: string };
		score: { data: Array<IChartData>, title?: string };
		years: { data: Array<number>, title?: string };
	} = {
		top_companies: {data: null},
		top_authorities: {data: null},
		score_in_years: {data: null},
		score_in_sectors: {data: null},
		lots_in_years: {data: null},
		cpvs_codes: {data: null},
		score: {data: null},
		terms_indicators_score: {data: null},
		years: {data: null}
	};
	public filter: {
		years?: { startValue: number, endValue: number };
	} = {};

	constructor(private api: ApiService, private i18n: I18NService, private notify: NotifyService) {
		this.viz.top_authorities.title = i18n.get('Main Buyers in Score Range');
		this.viz.top_companies.title = i18n.get('Main Suppliers in Score Range');
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.title = this.i18n.get(this.indicator.plural);
		this.icon = this.indicator.icon;
		this.subindicators = Utils.subindicators(this.indicator.id);
		this.displayIndicatorTitles();
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

	displayIndicatorTitles(): void {
		if (!this.selected) {
			this.indicatorTitle = this.i18n.get(this.indicator.plural);
			this.searchPrefix = this.indicator.id;
		} else {
			this.searchPrefix = this.selected.id;
			this.indicatorTitle = this.i18n.get(this.selected.name) + ' ' + this.i18n.get('Indicator');
		}
		this.viz.score_in_years.title = this.i18n.get('Average Score of') + ' ' + this.indicatorTitle + ' ' + this.i18n.get('over Time');
		this.viz.score_in_sectors.title = this.i18n.get('Average Score of') + ' ' + this.indicatorTitle + ' ' + this.i18n.get('per Sector');
		this.viz.lots_in_years.title = this.indicatorTitle + ' ' + this.i18n.get('in Score Range');
		this.viz.cpvs_codes.title = this.indicatorTitle + ' ' + this.i18n.get('in Score Range');
	}

	displayIndicator() {
		this.displayIndicatorTitles();
		this.visualize();
		this.search();
	}

	private displayStats(stats: IStats): void {
		let viz = this.viz;
		Object.keys(viz).forEach(key => {
			viz[key].data = null;
		});
		if (!stats) {
			return;
		}
		viz.score_in_sectors.data = stats.terms_main_cpv_divisions_score;
		viz.score_in_years.data = (stats.histogram_lots_awardDecisionDate_scores ? stats.histogram_lots_awardDecisionDate_scores[this.searchPrefix] : {}) || {};
		viz.top_companies.data = {absolute: stats.top_terms_companies, volume: stats.top_sum_finalPrice_companies};
		viz.top_authorities.data = {absolute: stats.top_terms_authorities, volume: stats.top_sum_finalPrice_authorities};
		viz.lots_in_years.data = stats.histogram_pc_lots_awardDecisionDate_finalPrices;
		viz.cpvs_codes.data = stats.terms_pc_main_cpv_divisions;
		viz.terms_indicators_score.data = stats.terms_indicators_score;
		viz.years.data = Object.keys(stats.histogram_pc_lots_awardDecisionDate_finalPrices || {}).map(key => parseInt(key, 10));
		if (stats.terms_score && stats.terms_score.hasOwnProperty(this.searchPrefix)) {
			viz.score.data = [{
				id: this.searchPrefix,
				name: this.indicatorTitle,
				value: stats.terms_score[this.searchPrefix],
				color: Consts.colors.indicators[this.searchPrefix]
			}];
		} else if (stats.terms_indicators_score && stats.terms_indicators_score.hasOwnProperty(this.searchPrefix)) {
			viz.score.data = [{
				id: this.searchPrefix,
				name: this.indicatorTitle,
				value: stats.terms_indicators_score[this.searchPrefix],
				color: Consts.colors.indicators[this.searchPrefix.split('_')[0]]
			}];
		}
	}

	onScoreSliderChange(event) {
		this.searchScore = [event.startValue, event.endValue];
		this.visualize();
		this.search();
	}

	onYearRangeSliderChange(event) {
		if (!this.viz.years.data) {
			return;
		}
		this.filter.years = event.data;
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
		if (this.filter.years) {
			let yearFilter: ISearchCommandFilter = {
				field: 'lots.awardDecisionDate',
				type: 'years',
				value: [this.filter.years.startValue, this.filter.years.endValue + 1],
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
