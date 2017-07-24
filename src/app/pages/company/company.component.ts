import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {SearchCommand} from '../../model/search';
import {TitleService} from '../../services/title.service';
import Body = Definitions.Body;
import {StateService} from '../../services/state.service';
import {IStats, ICompany, IStatsLotsInYears, IStatsCpvs, IStatsCounts, IStatsSumPrices, IStatsAuthorities} from '../../app.interfaces';
import {CountryService, Country} from '../../services/country.service';

@Component({
	moduleId: __filename,
	selector: 'company',
	templateUrl: 'company.template.html'
})
export class CompanyPage implements OnInit, OnDestroy {
	public company: Body;
	public country: Country;
	public error: string;
	public search_cmd: SearchCommand;
	public columnIds = ['id', 'title', 'titleEnglish', 'buyers.name', 'finalPrice'];
	private subscription: any;
	public similar: Array<ICompany> = [];
	public search_similars = {};

	private vis: {
		top_authorities: IStatsAuthorities,
		counts: IStatsCounts,
		cpvs_codes: IStatsCpvs,
		sums_finalPrice: IStatsSumPrices,
		lots_in_years: IStatsLotsInYears
	} = {
		top_authorities: null,
		sums_finalPrice: null,
		cpvs_codes: null,
		counts: null,
		lots_in_years: null
	};

	constructor(private route: ActivatedRoute, private api: ApiService, private titleService: TitleService,
				private state: StateService, private countryService: CountryService) {
		this.country = countryService.get();
	}

	ngOnInit(): void {
		let state = this.state.get('company');
		if (state) {
			this.columnIds = state.columnIds;
		}
		this.subscription = this.route.params.subscribe(params => {
			let id = params['id'];
			this.api.getCompany(id).subscribe(
				result => this.display(result.data),
				error => {
					this.error = error._body;
					// console.error(error);
				},
				() => {
					// console.log('company complete');
				});
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.state.put('company', {
			columnIds: this.columnIds
		});
	}

	getStats(ids: Array<string>) {
		this.api.getCompanyStats({ids: ids}).subscribe(
			result => this.displayStats(result.data),
			error => {
				this.error = error._body;
				// console.error(error);
			},
			() => {
				// console.log('company complete');
			});
	}

	getSimilars(id: string) {
		this.api.getCompanySimilar(id).subscribe(
			result => this.displaySimilar(result.data),
			error => {
				this.error = error._body;
				// console.error(error);
			},
			() => {
				// console.log('company complete');
			});
	}

	display(data: { company: ICompany }): void {
		if (data && data.company && data.company.body) {
			this.company = data.company.body;
			this.titleService.set(this.company.name);
			this.getSimilars(this.company.groupId);
			this.refresh();
		}
	}

	refresh(): void {
		if (!this.company) {
			return;
		}
		let ids = Object.keys(this.search_similars).filter((key) => {
			return this.search_similars[key];
		});
		ids.unshift(this.company.groupId);
		this.getStats(ids);
		this.search(ids);
	}

	toggleSimilar(sim: ICompany): void {
		this.search_similars[sim.body.groupId] = !this.search_similars[sim.body.groupId];
		this.refresh();
	}

	search(ids: Array<string>) {
		let filter = {
			field: 'lots.bids.bidders.groupId',
			type: 'term',
			value: ids
		};
		let search_cmd = new SearchCommand();
		search_cmd.filters = [filter];
		this.search_cmd = search_cmd;
	}

	displaySimilar(data: { similar: Array<ICompany> }): void {
		if (!data.similar) {
			return;
		}
		this.similar = data.similar;
	}

	displayStats(data: { stats: IStats }): void {
		let vis = {
			top_authorities: null,
			sums_finalPrice: null,
			cpvs_codes: null,
			counts: null,
			lots_in_years: null
		};
		if (!data || !data.stats) {
			this.vis = vis;
			return;
		}
		let stats = data.stats;
		vis.lots_in_years = stats.histogram_lots_awardDecisionDate;
		vis.counts = stats.count_lots_bids;
		vis.cpvs_codes = stats.terms_main_cpv_divisions;
		vis.sums_finalPrice = stats.sums_finalPrice;
		vis.top_authorities = stats.top_authorities;
		this.vis = vis;
	}

	searchChange(data) {
	}

	plain(o) {
		return JSON.stringify(o, null, '\t');
	}

}
