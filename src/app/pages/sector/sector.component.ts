import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {TitleService} from '../../services/title.service';
import {StateService} from '../../services/state.service';
import {NotifyService} from '../../services/notify.service';
import {I18NService} from '../../services/i18n.service';
import {
	ISector, IStats, IStatsPcCpvs, IStatsAuthorities, IStatsCompanies, IStatsSector, IStatsPcPricesLotsInYears, IStatsProcedureType,
	IStatsNuts, ISearchCommandFilter, ISearchCommand
} from '../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'sector',
	templateUrl: 'sector.template.html'
})
export class SectorPage implements OnInit, OnDestroy {
	private sector: ISector;
	private parent_sectors: Array<ISector> = [];
	private loading: number = 0;
	private search_cmd: ISearchCommand;
	private columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name'];
	private subscription: any;
	private viz: {
		authority_nuts: IStatsNuts,
		cpvs_codes: { data: IStatsPcCpvs, title?: string },
		histogram: { data: IStatsPcPricesLotsInYears, title?: string },
		procedure_types: { data: IStatsProcedureType, title?: string },
		subsectors: Array<{ sector: ISector; stats: IStats }>,
		top_authorities: { absolute: IStatsAuthorities, volume: IStatsAuthorities },
		top_companies: { absolute: IStatsCompanies, volume: IStatsCompanies },
	} = {
		authority_nuts: {data: null},
		cpvs_codes: {data: null},
		histogram: {data: null},
		procedure_types: {data: null},
		subsectors: [],
		top_authorities: null,
		top_companies: null,
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

	constructor(private route: ActivatedRoute, private api: ApiService, private titleService: TitleService,
				private state: StateService, private notify: NotifyService, private i18n: I18NService) {
		this.viz.cpvs_codes.title = i18n.get('Sector');
		this.viz.histogram.title = i18n.get('Subsectors');
		this.viz.procedure_types.title = i18n.get('Procedure Type');
	}

	ngOnInit(): void {
		let state = this.state.get('sector');
		if (state) {
			this.columnIds = state.columnIds;
		}
		this.subscription = this.route.params.subscribe(params => {
			let id = params['id'];
			this.loading++;
			this.api.getSectorStats({ids: [id]}).subscribe(
				(result) => {
					this.display(result.data);
				},
				(error) => {
					this.notify.error(error);
				},
				() => {
					this.loading--;
				});
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.state.put('sector', {
			columnIds: this.columnIds
		});
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

	buildFilters() {
		let filters = [];
		if (this.filter.time && this.filter.time.selectedStartYear > 0 && this.filter.time.selectedEndYear > 0) {
			let yearFilter: ISearchCommandFilter = {
				field: 'lots.awardDecisionDate',
				type: 'range',
				value: [this.filter.time.selectedStartYear, this.filter.time.selectedEndYear + 1],
			};
			filters.push(yearFilter);
		}
		return filters;
	}

	visualize() {
		if (!this.sector) {
			return;
		}
		let filters = this.buildFilters();
		this.loading++;
		this.api.getSectorStats({ids: [this.sector.id], filters: filters}).subscribe(
			(result) => this.displayStats(result.data.stats),
			(error) => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
			});
	}

	display(data: IStatsSector): void {
		this.sector = null;
		this.parent_sectors = [];
		if (!data) {
			return;
		}
		this.sector = data.sector;
		this.parent_sectors = data.parents || [];
		if (data.sector) {
			this.titleService.set(data.sector.name);
		}

		this.displayStats(data.stats);
		this.search();
	}

	displayStats(stats: IStats): void {
		if (!this.filter.time && stats.histogram_pc_lots_awardDecisionDate_finalPrices) {
			let startYear = 0;
			let endYear = 0;
			Object.keys(stats.histogram_pc_lots_awardDecisionDate_finalPrices).forEach((key) => {
				let year = parseInt(key, 10);
				startYear = startYear === 0 ? year : Math.min(year, startYear);
				endYear = endYear === 0 ? year : Math.max(year, endYear);
			});
			this.filter.time = {
				startYear, endYear,
				selectedStartYear: startYear,
				selectedEndYear: endYear
			};
		}
		if (!stats) {
			return;
		}
		let viz = this.viz;
		viz.cpvs_codes.data = null;
		viz.histogram.data = stats.histogram_pc_lots_awardDecisionDate_finalPrices;
		viz.procedure_types.data = stats.terms_procedure_type;
		viz.top_companies = {absolute: stats.top_terms_companies, volume: stats.top_sum_finalPrice_companies};
		viz.top_authorities = {absolute: stats.top_terms_authorities, volume: stats.top_sum_finalPrice_authorities};
		viz.subsectors = stats.sectors_stats;
		viz.authority_nuts = stats.terms_authority_nuts;

		if (viz.subsectors) {
			viz.cpvs_codes.data = {};
			viz.subsectors.forEach(sub => {
				viz.cpvs_codes.data[sub.sector.id] = {
					name: sub.sector.name, value: sub.sector.value, percent: 5, total: 100
				};
			});
		}

		this.viz = viz;
	}

	search() {
		if (!this.sector) {
			return;
		}
		let filters = this.buildFilters();
		let subfilter: ISearchCommandFilter = {
			field: 'cpvs.isMain',
			type: 'term',
			value: [true]
		};
		let filter: ISearchCommandFilter = {
			field: this.sector.level ? 'cpvs.code.' + this.sector.level : 'cpvs.code',
			type: 'term',
			value: [this.sector.id],
			and: [subfilter]
		};
		filters.push(filter);
		this.search_cmd = {filters: filters};
	}

	searchChange(data) {
	}

}
