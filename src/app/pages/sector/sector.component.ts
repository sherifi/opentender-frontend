import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {SearchCommand, SearchCommandFilter} from '../../model/search';
import {TitleService} from '../../services/title.service';
import {StateService} from '../../services/state.service';
import {ISector, IStats, IStatsCounts, IStatsPcCpvs, IStatsLotsInYears, IStatsSumPrices, IStatsAuthorities, IStatsCompanies, ISectorStats} from '../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'sector',
	templateUrl: 'sector.template.html'
})
export class SectorPage implements OnInit, OnDestroy {
	public sector: ISector;
	public parent_sectors: Array<ISector> = [];
	public error: string;
	public search_cmd: SearchCommand;
	public columnIds = ['id', 'title', 'titleEnglish', 'buyers.name', 'lots.bids.bidders'];
	private subscription: any;
	vis: {
		subgroups: Array<any>,
		top_companies: IStatsCompanies,
		top_authorities: IStatsAuthorities,
		sums_finalPrice: IStatsSumPrices,
		lots_in_years: IStatsLotsInYears,
		cpvs_codes: IStatsPcCpvs,
		counts: IStatsCounts
	} = {
		subgroups: [],
		top_companies: null,
		top_authorities: null,
		sums_finalPrice: null,
		lots_in_years: null,
		cpvs_codes: null,
		counts: null
	};

	constructor(private route: ActivatedRoute, private api: ApiService, private titleService: TitleService, private state: StateService) {
	}

	ngOnInit(): void {
		let state = this.state.get('sector');
		if (state) {
			this.columnIds = state.columnIds;
		}
		this.subscription = this.route.params.subscribe(params => {
			let id = params['id'];
			this.api.getSectorStats({id: id}).subscribe(
				(result) => this.display(result.data),
				(error) => {
					this.error = error._body;
					// console.error(error);
				},
				() => {
					// console.log('sector complete');
				});
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.state.put('sector', {
			columnIds: this.columnIds
		});
	}

	display(data: ISectorStats): void {
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

	displayStats(data: IStats): void {
		let vis = {
			subgroups: [],
			top_authorities: null,
			top_companies: null,
			sums_finalPrice: null,
			cpvs_codes: null,
			lots_in_years: null,
			counts: null
		};
		if (!data) {
			this.vis = vis;
			return;
		}
		vis.cpvs_codes = data.terms_main_cpv_categories || data.terms_main_cpv_groups || data.terms_main_cpv_categories || data.terms_main_cpv_full;
		vis.lots_in_years = data.histogram_lots_awardDecisionDate;
		vis.counts = data.count_lots_bids;
		vis.sums_finalPrice = data.sums_finalPrice;
		vis.top_companies = data.top_companies;
		vis.top_authorities = data.top_authorities;

		if (vis.cpvs_codes) {
			Object.keys(vis.cpvs_codes).forEach(key => {
				if (this.sector && key !== this.sector.id) {
					vis.subgroups.push({id: key, name: vis.cpvs_codes[key].name, value: vis.cpvs_codes[key].value});
				}
			});
			vis.subgroups.sort((a, b) => {
				if (a.value > b.value) {
					return -1;
				}
				if (a.value < b.value) {
					return 1;
				}
				if (a.name < b.name) {
					return -1;
				}
				if (a.name > b.name) {
					return 1;
				}
				return 0;
			});
		}

		this.vis = vis;
	}

	search() {
		if (!this.sector) {
			return;
		}
		let subfilter: SearchCommandFilter = {
			field: 'cpvs.isMain',
			type: 'term',
			value: [true]
		};
		let filter: SearchCommandFilter = {
			field: this.sector.level ? 'cpvs.code.' + this.sector.level : 'cpvs.code',
			type: 'term',
			value: [this.sector.id],
			and: [subfilter]
		};
		let search_cmd = new SearchCommand();
		search_cmd.filters = [filter];
		this.search_cmd = search_cmd;
	}

	searchChange(data) {
	}

}
