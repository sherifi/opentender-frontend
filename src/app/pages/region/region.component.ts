import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {StateService} from '../../services/state.service';
import {NotifyService} from '../../services/notify.service';
import {TitleService} from '../../services/title.service';
import {IStats, IRegion, IStatsRegion, IStatsAuthorities, IStatsCompanies, IStatsPcPricesLotsInYears, ISearchCommand} from '../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'region',
	templateUrl: 'region.template.html'
})
export class RegionPage implements OnInit, OnDestroy {
	public region: IRegion;
	public parent_regions: Array<IRegion> = [];
	private loading: number = 0;
	public search_cmd: ISearchCommand;
	public columnIds = ['id', 'title', 'titleEnglish', 'buyers.name', 'lots.bids.bidders'];
	private subscription: any;

	private viz: {
		top_companies: { absolute: IStatsCompanies, volume: IStatsCompanies },
		top_authorities: { absolute: IStatsAuthorities, volume: IStatsAuthorities },
		histogram: { data: IStatsPcPricesLotsInYears, title?: string },
	} = {
		top_companies: null,
		top_authorities: null,
		histogram: {data: null},
	};

	constructor(private route: ActivatedRoute, private api: ApiService, private notify: NotifyService, private titleService: TitleService, private state: StateService) {
	}

	ngOnInit(): void {
		let state = this.state.get('region');
		if (state) {
			this.columnIds = state.columnIds;
		}
		this.subscription = this.route.params.subscribe(params => {
			let id = params['id'];
			this.loading++;
			this.api.getRegionStats({ids: [id]}).subscribe(
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
		this.state.put('region', {
			columnIds: this.columnIds
		});
	}

	display(data: IStatsRegion): void {
		this.region = null;
		this.parent_regions = [];
		if (!data) {
			return;
		}
		this.titleService.set(data.region.name);
		this.region = data.region;
		this.parent_regions = data.parents || [];
		this.displayStats(data.stats);
		this.search();
	}

	private displayStats(stats: IStats): void {
		if (!stats) {
			return;
		}
		let viz = this.viz;
		viz.histogram.data = stats.histogram_pc_lots_awardDecisionDate_finalPrices;
		viz.top_companies = {absolute: stats.top_terms_companies, volume: stats.top_sum_finalPrice_companies};
		viz.top_authorities = {absolute: stats.top_terms_authorities, volume: stats.top_sum_finalPrice_authorities};

		this.viz = viz;
	}

	search() {
		if (!this.region) {
			return;
		}
		let field = (this.region.id.length >= 2) ? '.nuts' + (this.region.id.length - 2) : '';

		this.search_cmd = {
			filters: [
				{
					field: 'buyers.address.nuts' + field,
					type: 'term',
					value: [this.region.id]
				},
				// TODO: implement OR parameter ?
				// {
				// 	field: 'lots.bids.bidders.address.nuts' + field,
				// 	type: 'term',
				// 	value: [this.region.id]
				// }
			]
		};
	}

	searchChange(data) {
	}

}
