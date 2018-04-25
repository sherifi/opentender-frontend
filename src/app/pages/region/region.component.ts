import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {StateService} from '../../services/state.service';
import {NotifyService} from '../../services/notify.service';
import {TitleService} from '../../services/title.service';
import {IStats, IRegion, IStatsRegion, IStatsAuthorities, IStatsCompanies, ISearchCommand, IStatsNuts, IStatsInYears, IBreadcrumb, IStatsIndicators, IStatsDistributionInYears, IBenchmarkFilter} from '../../app.interfaces';
import {I18NService} from '../../modules/i18n/services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'region',
	templateUrl: 'region.component.html'
})
export class RegionPage implements OnInit, OnDestroy {
	public region: IRegion;
	public parent_regions: Array<IRegion> = [];
	public child_regions: Array<IRegion> = [];
	public crumbs: Array<IBreadcrumb> = [];
	public notFound: boolean = false;
	private loading: number = 0;
	public search_cmd: ISearchCommand;
	public columnIds = ['id', 'title', 'titleEnglish', 'buyers.name', 'lots.bids.bidders'];
	private subscription: any;

	public viz: {
		top_companies: { data: { absolute: IStatsCompanies, volume: IStatsCompanies }, title?: string };
		top_authorities: { data: { absolute: IStatsAuthorities, volume: IStatsAuthorities }, title?: string };
		histogram: { data: IStatsInYears, title?: string };
		child_regions: { data: IStatsNuts, title?: string };
		benchmarks: { data: IStats, title?: string, filters?: Array<IBenchmarkFilter> };
	} = {
		benchmarks: {data: null},
		top_companies: {data: null},
		top_authorities: {data: null},
		child_regions: {data: null},
		histogram: {data: null},
	};

	constructor(private route: ActivatedRoute, private api: ApiService, private notify: NotifyService,
				private titleService: TitleService, private i18n: I18NService, private state: StateService) {
		this.viz.top_companies.title = i18n.get('Main Suppliers');
		this.viz.top_authorities.title = i18n.get('Main Buyers');
		this.viz.benchmarks.title = this.i18n.get('Benchmark Current Region');
		this.buildCrumbs();
	}

	public ngOnInit(): void {
		let state = this.state.get('region');
		if (state) {
			this.columnIds = state.columnIds;
		}
		this.subscription = this.route.params.subscribe(params => {
			let id = params['id'];
			this.loading++;
			this.notFound = false;
			let sub = this.api.getRegionStats({ids: [id]}).subscribe(
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
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
		this.subscription = null;
		this.state.put('region', {
			columnIds: this.columnIds
		});
	}

	public buildCrumbs(): void {
		this.crumbs = [
			{name: this.i18n.get('Region')}
		];
		if (this.parent_regions) {
			this.parent_regions.forEach(region => {
				this.crumbs.push({
					name: region.name,
					link: '/region/' + region.id
				});
			});
		}
		if (this.region) {
			this.crumbs.push({
				name: this.region.name
			});
		}
	}

	private display(data: IStatsRegion): void {
		this.region = null;
		this.parent_regions = [];
		this.child_regions = [];
		if (!data) {
			return;
		}
		this.titleService.set(data.region.name);
		this.region = data.region;
		this.parent_regions = data.parents || [];
		this.parent_regions.sort((a, b) => {
			return a.level - b.level;
		});
		this.child_regions = data.children || [];
		this.displayStats(data.stats);
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
		viz.histogram.data = stats.histogram;
		viz.top_companies.data = {absolute: stats.top_terms_companies, volume: stats.top_sum_finalPrice_companies};
		viz.top_authorities.data = {absolute: stats.top_terms_authorities, volume: stats.top_sum_finalPrice_authorities};
		viz.child_regions.data = stats.terms_subregions_nuts;
		viz.benchmarks.data = stats;
	}

	public benchmarkFilterChange(event) {
	}

	public search(): void {
		if (!this.region) {
			return;
		}
		let field = (this.region.id.length >= 2) ? '.nuts' + (this.region.id.length - 2) : '';

		this.search_cmd = {
			filters: [
				{
					field: 'buyers.address.ot.nutscode' + field,
					type: 'term',
					value: [this.region.id]
				}
			]
		};
	}

	public searchChange(data): void {
	}

}
