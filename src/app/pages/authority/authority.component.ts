import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {SearchCommand} from '../../model/search';
import {TitleService} from '../../services/title.service';
import Buyer = Definitions.Buyer;
import {StateService} from '../../services/state.service';
import {IAuthority, IStats, IStatsCompanies, IStatsCounts, IStatsCpvs, IStatsPrices, IStatsLotsInYears, IStatsNuts} from '../../app.interfaces';
import {CountryService, Country} from '../../services/country.service';

@Component({
	moduleId: __filename,
	selector: 'authority',
	templateUrl: 'authority.template.html'
})
export class AuthorityPage implements OnInit, OnDestroy {
	public authority: Buyer;
	public country: Country;
	public error: string;
	public search_cmd: SearchCommand;
	public columnIds = ['id', 'title', 'titleEnglish', 'lots.bids.bidders.name', 'finalPrice'];
	private subscription: any;
	public similar: Array<IAuthority> = [];
	public search_similars = {};

	private viz: {
		top_companies: IStatsCompanies,
		counts: IStatsCounts,
		cpvs_codes: IStatsCpvs,
		sums_finalPrice: IStatsPrices,
		company_nuts: IStatsNuts,
		lots_in_years: IStatsLotsInYears
	} = {
		top_companies: null,
		sums_finalPrice: null,
		cpvs_codes: null,
		counts: null,
		company_nuts: null,
		lots_in_years: null
	};

	constructor(private route: ActivatedRoute, private api: ApiService, private titleService: TitleService,
				private state: StateService, private countryService: CountryService) {
		this.country = countryService.get();
	}

	ngOnInit(): void {
		let state = this.state.get('authority');
		if (state) {
			this.columnIds = state.columnIds;
		}
		this.subscription = this.route.params.subscribe(params => {
			let id = params['id'];
			this.api.getAuthority(id).subscribe(
				(result) => this.display(result.data),
				(error) => {
					this.error = error._body;
					// console.error(error);
				},
				() => {
					// console.log('authority complete');
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
			this.getSimilars(this.authority.groupId);
			this.refresh();
		}
	}

	getStats(ids: Array<string>) {
		this.api.getAuthorityStats({ids: ids}).subscribe(
			result => this.displayStats(result.data),
			error => {
				this.error = error._body;
				// console.error(error);
			},
			() => {
				// console.log('authority complete');
			});
	}

	getSimilars(id: string) {
		this.api.getAuthoritySimilar(id).subscribe(
			result => this.displaySimilar(result.data),
			error => {
				this.error = error._body;
				// console.error(error);
			},
			() => {
				// console.log('authority complete');
			});
	}

	displaySimilar(data: { similar: Array<IAuthority> }): void {
		if (!data.similar) {
			return;
		}
		this.similar = data.similar;
	}

	refresh(): void {
		if (!this.authority) {
			return;
		}
		let ids = Object.keys(this.search_similars).filter((key) => {
			return this.search_similars[key];
		});
		ids.unshift(this.authority.groupId);
		this.getStats(ids);
		this.search(ids);
	}

	displayStats(data: { stats: IStats }): void {
		let viz = {
			top_companies: null,
			sums_finalPrice: null,
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
		viz.sums_finalPrice = stats.sums_finalPrice;
		viz.cpvs_codes = stats.terms_main_cpv_divisions;
		viz.counts = stats.count_lots_bids;
		viz.top_companies = stats.top_winning_companies;
		viz.company_nuts = stats.terms_company_nuts;
		this.viz = viz;
	}


	toggleSimilar(sim: IAuthority): void {
		this.search_similars[sim.body.groupId] = !this.search_similars[sim.body.groupId];
		this.refresh();
	}

	search(ids: Array<string>) {
		let search_cmd = new SearchCommand();
		search_cmd.filters = [{
			field: 'buyers.groupId',
			type: 'term',
			value: ids
		}];
		this.search_cmd = search_cmd;
	}

	searchChange(data) {
	}

	plain(o) {
		return JSON.stringify(o, null, '\t');
	}

}
