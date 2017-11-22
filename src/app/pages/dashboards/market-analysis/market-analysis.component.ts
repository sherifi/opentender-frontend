import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {NotifyService} from '../../../services/notify.service';
import {ISector, IStats, IStatsNuts, ISearchCommandFilter, IStatsInYears, IStatsCpvs, IStatsPricesLotsInYears, IStatsProcedureType, IStatsAuthorities, IStatsCompanies} from '../../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'market-analysis',
	templateUrl: 'market-analysis.template.html'
})
export class DashboardsMarketAnalysisPage implements OnInit, OnDestroy {
	public sectors_stats: Array<{ sector: ISector, stats: IStats }> = [];
	public loading: number = 0;
	public viz: {
		sectors_stats: Array<{ sector: ISector; stats: IStats }>;
		score_in_years: IStatsInYears;
		score_in_sectors: IStatsCpvs;
		procedure_types: IStatsProcedureType,
		volume_regions: IStatsNuts;
		lots_in_years: IStatsPricesLotsInYears;
		top_authorities: { absolute: IStatsAuthorities, volume: IStatsAuthorities },
		top_companies: { absolute: IStatsCompanies, volume: IStatsCompanies },
	} = {
		sectors_stats: null,
		score_in_sectors: null,
		score_in_years: null,
		procedure_types: null,
		lots_in_years: null,
		volume_regions: null,
		top_authorities: null,
		top_companies: null,
	};
	public filter: {
		time?: {
			startYear: number;
			endYear: number;
			selectedStartYear: number;
			selectedEndYear: number;
		}
	} = {
		time: null
	};

	constructor(private api: ApiService, private notify: NotifyService) {
	}


	onSliderChange(event) {
		if (!this.filter.time) {
			return;
		}
		this.filter.time.selectedStartYear = event.startValue;
		this.filter.time.selectedEndYear = event.endValue;
		this.visualize();
	}

	visualize() {
		let filters = this.buildFilters();
		this.loading++;
		this.api.getMarketAnalysisStats({filters: filters}).subscribe(
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

	public ngOnInit(): void {
		this.visualize();
		// this.search();
	}

	public ngOnDestroy(): void {
	}

	buildFilters() {
		let filters = [];
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

	private displayStats(stats: IStats): void {
		this.sectors_stats = [];
		let viz = this.viz;
		viz.sectors_stats = null;
		viz.volume_regions = null;
		viz.score_in_years = null;
		viz.lots_in_years = null;
		viz.score_in_sectors = null;
		viz.top_authorities = null;
		viz.top_companies = null;
		if (stats) {
			viz.sectors_stats = stats.sectors_stats;
			this.sectors_stats = stats.sectors_stats;
			let nuts = {};
			stats.region_stats.forEach(region => {
				nuts[region.id] = region.stats.sum_finalPriceEUR.value || 0;
			});
			viz.volume_regions = nuts;
			viz.score_in_years = stats.histogram_lots_awardDecisionDate_scores['TENDER'] || {};
			viz.score_in_sectors = stats.terms_main_cpv_divisions_score;
			viz.lots_in_years = stats.histogram_lots_awardDecisionDate_finalPrices;
			viz.procedure_types = stats.terms_procedure_type;
			viz.top_companies = {absolute: stats.top_terms_companies, volume: stats.top_sum_finalPrice_companies};
			viz.top_authorities = {absolute: stats.top_terms_authorities, volume: stats.top_sum_finalPrice_authorities};
		}
		if (!this.filter.time && stats.histogram_lots_awardDecisionDate) {
			let startYear = 0;
			let endYear = 0;
			Object.keys(stats.histogram_lots_awardDecisionDate).forEach((key) => {
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

}
