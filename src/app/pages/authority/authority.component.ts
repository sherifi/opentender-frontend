import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {SearchCommand} from '../../model/search';
import {TitleService} from '../../services/title.service';
import {StateService} from '../../services/state.service';
import {IAuthority, IStats, IStatsCompanies, IStatsCounts, IStatsCpvs, IStatsPrices, IStatsLotsInYears, IStatsNuts} from '../../app.interfaces';

/// <reference path="./model/tender.d.ts" />
import Buyer = Definitions.Buyer;
import {ConfigService, Country} from '../../services/config.service';
import {NotifyService} from '../../services/notify.service';

@Component({
	moduleId: __filename,
	selector: 'authority',
	templateUrl: 'authority.template.html'
})
export class AuthorityPage implements OnInit, OnDestroy {
	public authority: Buyer;
	public country: Country;
	public loading: number = 0;
	public search_cmd: SearchCommand;
	public columnIds = ['id', 'title', 'titleEnglish', 'lots.bids.bidders.name', 'finalPrice'];
	private subscription: any;
	private include_authorities_ids: Array<string> = [];
	public similar: Array<Body> = [];

	private viz: {
		top_companies: { absolute: IStatsCompanies, volume: IStatsCompanies },
		counts: IStatsCounts,
		cpvs_codes: IStatsCpvs,
		company_nuts: IStatsNuts,
		lots_in_years: IStatsLotsInYears
	} = {
		top_companies: null,
		cpvs_codes: null,
		counts: null,
		company_nuts: null,
		lots_in_years: null
	};

	constructor(private route: ActivatedRoute, private api: ApiService, private titleService: TitleService,
				private state: StateService, private config: ConfigService, private notify: NotifyService) {
		this.country = config.country;
	}

	ngOnInit(): void {
		let state = this.state.get('authority');
		if (state) {
			this.columnIds = state.columnIds;
		}
		this.subscription = this.route.params.subscribe(params => {
			let id = params['id'];
			this.loading++;
			this.api.getAuthority(id).subscribe(
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
		this.state.put('authority', {
			columnIds: this.columnIds
		});
	}

	display(data: { authority: IAuthority }): void {
		if (data && data.authority) {
			this.authority = data.authority.body;
			this.titleService.set(this.authority.name);
			this.getSimilars(this.authority.id);
			this.refresh();
		}
	}

	getStats(ids: Array<string>) {
		this.loading++;
		this.api.getAuthorityStats({ids: ids}).subscribe(
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

	getSimilars(id: string) {
		this.loading++;
		this.api.getAuthoritySimilar(id).subscribe(
			result => this.displaySimilar(result.data),
			error => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
			});
	}

	displaySimilar(data: { similar: Array<IAuthority> }): void {
		if (!data.similar) {
			return;
		}
		this.similar = data.similar.map(authority => <Body>authority.body);
	}

	refresh(): void {
		if (!this.authority) {
			return;
		}
		let ids = [this.authority.id].concat(this.include_authorities_ids);
		this.getStats(ids);
		this.search(ids);
	}

	displayStats(data: { stats: IStats }): void {
		let viz = {
			top_companies: null,
			cpvs_codes: null,
			counts: null,
			lots_in_years: null,
			company_nuts: null
		};
		if (!data || !data.stats) {
			this.viz = viz;
			return;
		}
		let stats = data.stats;
		viz.lots_in_years = stats.histogram_lots_awardDecisionDate;
		viz.cpvs_codes = stats.terms_main_cpv_divisions;
		viz.counts = stats.count_lots_bids;
		viz.top_companies = {absolute: stats.top_terms_companies, volume: stats.top_sum_finalPrice_companies};
		viz.company_nuts = stats.terms_company_nuts;
		this.viz = viz;
	}

	search(ids: Array<string>) {
		let search_cmd = new SearchCommand();
		search_cmd.filters = [{
			field: 'buyers.id',
			type: 'term',
			value: ids
		}];
		this.search_cmd = search_cmd;
	}

	similarChange(data) {
		this.include_authorities_ids = data.value;
		this.refresh();
	}

	searchChange(data) {
	}


}
