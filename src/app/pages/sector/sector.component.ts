import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {TitleService} from '../../services/title.service';
import {StateService} from '../../services/state.service';
import {NotifyService} from '../../services/notify.service';
import {I18NService} from '../../modules/i18n/services/i18n.service';
import {
	ISector, IStats, IStatsAuthorities, IStatsCompanies, IStatsSector, IStatsPcPricesLotsInYears, IStatsProcedureType,
	IStatsNuts, ISearchCommandFilter, ISearchCommand, IStatsCpvs, IStatsInYears, IBreadcrumb
} from '../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'sector',
	templateUrl: 'sector.component.html'
})
export class SectorPage implements OnInit, OnDestroy {
	public sector: ISector;
	public parent_sectors: Array<ISector> = [];
	public loading: number = 0;
	public notFound: boolean = false;
	public search_cmd: ISearchCommand;
	public crumbs: Array<IBreadcrumb> = [];
	public columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name'];
	public viz: {
		histogram: { data: IStatsPcPricesLotsInYears, title?: string };
		score_in_years: { data: IStatsInYears, title?: string };
		score_in_sectors: { data: IStatsCpvs, title?: string };
		top_authorities: { data: { absolute: IStatsAuthorities, volume: IStatsAuthorities }, title?: string };
		top_companies: { data: { absolute: IStatsCompanies, volume: IStatsCompanies }, title?: string };
		authority_nuts: { data: IStatsNuts, title?: string };
		procedure_types: { data: IStatsProcedureType, title?: string };
		subsectors: { data: Array<{ sector: ISector; stats: IStats }>, title?: string };
		years: { data: Array<number>, title?: string };
	} = {
		authority_nuts: {data: null},
		histogram: {data: null},
		procedure_types: {data: null},
		subsectors: {data: null},
		score_in_years: {data: null},
		score_in_sectors: {data: null},
		top_authorities: {data: null},
		top_companies: {data: null},
		years: {data: null},
	};
	public filter: {
		years?: { startValue: number, endValue: number };
	} = {};
	private subscription: any;

	constructor(private route: ActivatedRoute, private api: ApiService, private titleService: TitleService,
				private state: StateService, private notify: NotifyService, private i18n: I18NService) {
		this.viz.histogram.title = i18n.get('Sector');
		this.viz.subsectors.title = i18n.get('Sector Overview');
		this.viz.score_in_years.title = i18n.get('Average Good Procurement Score over Time');
		this.viz.score_in_sectors.title = i18n.get('Average Good Procurement Score per Sector');
		this.viz.top_authorities.title = i18n.get('Main Buyers');
		this.viz.top_companies.title = i18n.get('Main Suppliers');
		this.viz.procedure_types.title = this.i18n.get('Procedure Type');
		this.buildCrumbs();
	}

	public buildCrumbs(): void {
		this.crumbs = [
			{name: this.i18n.get('Sector')}
		];
		if (this.parent_sectors) {
			this.parent_sectors.forEach(sector => {
				this.crumbs.push({
					name: sector.name,
					link: '/sector/' + sector.id
				});
			});
		}
		if (this.sector) {
			this.crumbs.push({
				name: this.sector.name
			});
		}
	}

	public ngOnInit(): void {
		let state = this.state.get('sector');
		if (state) {
			this.columnIds = state.columnIds;
		}
		this.subscription = this.route.params.subscribe(params => {
			let id = params['id'];
			this.loading++;
			this.notFound = false;
			let sub = this.api.getSectorStats({ids: [id]}).subscribe(
				(result) => {
					this.display(result.data);
				},
				(error) => {
					this.display(null);
					if (error.status == 404) {
						this.notFound = true;
					} else {
						this.notify.error(error);
					}
				},
				() => {
					this.loading--;
					sub.unsubscribe();
				});
		});
	}

	public ngOnDestroy(): void {
		this.subscription.unsubscribe();
		this.state.put('sector', {
			columnIds: this.columnIds
		});
	}

	public onYearRangeSliderChange(event): void {
		if (!this.viz.years.data) {
			return;
		}
		this.filter.years = event.data;
		this.visualize();
		this.search();
	}

	private buildFilters() {
		let filters = [];
		if (this.filter.years) {
			let yearFilter: ISearchCommandFilter = {
				field: 'ot.date',
				type: 'years',
				value: [this.filter.years.startValue, this.filter.years.endValue + 1],
			};
			filters.push(yearFilter);
		}
		return filters;
	}

	private visualize() {
		if (!this.sector) {
			return;
		}
		let filters = this.buildFilters();
		this.loading++;
		let sub = this.api.getSectorStats({ids: [this.sector.id], filters: filters}).subscribe(
			(result) => this.displayStats(result.data.stats),
			(error) => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
				sub.unsubscribe();
			});
	}

	private display(data: IStatsSector): void {
		this.sector = null;
		this.parent_sectors = [];
		if (!data) {
			this.buildCrumbs();
			return;
		}
		this.sector = data.sector;
		this.parent_sectors = data.parents || [];
		this.parent_sectors.sort((a, b) => {
			return a.id.length - b.id.length;
		});
		if (data.sector) {
			this.titleService.set(data.sector.name);
		}
		let filters = this.buildFilters();
		if (filters.length > 0) {
			this.visualize();
		} else {
			this.displayStats(data.stats);
		}
		this.buildCrumbs();
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
		viz.histogram.data = stats.histogram_count_finalPrices;
		viz.procedure_types.data = stats.terms_procedure_type;
		viz.top_companies.data = {absolute: stats.top_terms_companies, volume: stats.top_sum_finalPrice_companies};
		viz.top_authorities.data = {absolute: stats.top_terms_authorities, volume: stats.top_sum_finalPrice_authorities};
		viz.subsectors.data = stats.sectors_stats;
		viz.authority_nuts.data = stats.terms_authority_nuts;
		viz.score_in_years.data = (stats.histogram_indicators ? stats.histogram_indicators['TENDER'] : {}) || {};
		viz.years.data = Object.keys(stats.histogram_count_finalPrices || {}).map(key => parseInt(key, 10));

		let sub_scores = stats.terms_main_cpv_divisions_scores || stats.terms_main_cpv_groups_scores || stats.terms_main_cpv_categories_scores || stats.terms_main_cpv_full_scores;
		viz.score_in_sectors.data = {};
		if (sub_scores) {
			Object.keys(sub_scores).forEach(key => {
				let part = sub_scores[key];
				if (part.scores['TENDER'] !== null) {
					viz.score_in_sectors.data[key] = {
						name: part.name,
						value: part.scores['TENDER']
					};
				}
			});
		}
	}

	search() {
		if (!this.sector) {
			return;
		}
		let filters = this.buildFilters();
		let filter: ISearchCommandFilter = {
			field: this.sector.level ? 'ot.cpv.' + this.sector.level : 'ot.cpv',
			type: 'term',
			value: [this.sector.id],
		};
		filters.push(filter);
		this.search_cmd = {filters: filters};
	}

	searchChange(data) {
	}

}
