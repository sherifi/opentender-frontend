import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {SearchCommand} from '../../model/search';
import {TitleService} from '../../services/title.service';
import {StateService} from '../../services/state.service';
import {ConfigService, Country} from '../../services/config.service';
import {IStats, ICompany, IStatsLotsInYears, IStatsCpvs, IStatsCounts, IStatsPrices, IStatsAuthorities, IStatsNuts} from '../../app.interfaces';

/// <reference path="./model/tender.d.ts" />
import Body = Definitions.Body;
import {NotifyService} from '../../services/notify.service';

@Component({
	moduleId: __filename,
	selector: 'company',
	templateUrl: 'company.template.html'
})
export class CompanyPage implements OnInit, OnDestroy {
	public company: Body;
	public country: Country;
	public search_cmd: SearchCommand;
	public columnIds = ['id', 'title', 'titleEnglish', 'buyers.name', 'finalPrice'];
	public similar: Array<Body> = [];
	public include_companies_ids: Array<string> = [];
	public loading: number = 0;
	private subscription: any;

	private viz: {
		authority_nuts: IStatsNuts,
		top_authorities: { absolute: IStatsAuthorities, volume: IStatsAuthorities },
		counts: IStatsCounts,
		cpvs_codes: IStatsCpvs,
		lots_in_years: IStatsLotsInYears
	} = {
		authority_nuts: null,
		top_authorities: null,
		cpvs_codes: null,
		counts: null,
		lots_in_years: null
	};

	constructor(private route: ActivatedRoute, private api: ApiService, private titleService: TitleService,
				private state: StateService, private config: ConfigService, private notify: NotifyService) {
		this.country = config.country;
	}

	ngOnInit(): void {
		let state = this.state.get('company');
		if (state) {
			this.columnIds = state.columnIds;
		}
		this.subscription = this.route.params.subscribe(params => {
			let id = params['id'];
			this.loading++;
			this.api.getCompany(id).subscribe(
				result => {
					this.display(result.data);
				},
				error => {
					this.notify.error(error);
				},
				() => {
					this.loading--;
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
		this.loading++;
		this.api.getCompanyStats({ids: ids}).subscribe(
			result => {
				this.displayStats(result.data);
			},
			error => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
			});
	}

	getSimilars(id: string) {
		this.loading++;
		this.api.getCompanySimilar(id).subscribe(
			result => {
				this.displaySimilar(result.data);
			},
			error => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
			});
	}

	display(data: { company: ICompany }): void {
		if (data && data.company && data.company.body) {
			this.company = data.company.body;
			this.titleService.set(this.company.name);
			this.getSimilars(this.company.id);
			this.refresh();
		}
	}

	refresh(): void {
		if (!this.company) {
			return;
		}
		let ids = [this.company.id].concat(this.include_companies_ids);
		this.getStats(ids);
		this.search(ids);
	}

	search(ids: Array<string>) {
		let filter = {
			field: 'lots.bids.bidders.id',
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
		this.similar = data.similar.map(company => company.body);
	}

	displayStats(data: { stats: IStats }): void {
		let viz = {
			authority_nuts: null,
			top_authorities: null,
			cpvs_codes: null,
			counts: null,
			lots_in_years: null
		};
		if (!data || !data.stats) {
			this.viz = viz;
			return;
		}
		let stats = data.stats;
		viz.lots_in_years = stats.histogram_lots_awardDecisionDate;
		viz.counts = stats.count_lots_bids;
		viz.cpvs_codes = stats.terms_main_cpv_divisions;
		viz.top_authorities = {absolute: stats.top_terms_authorities, volume: stats.top_sum_finalPrice_authorities};
		viz.authority_nuts = stats.terms_authority_nuts;
		this.viz = viz;
	}

	similarChange(data) {
		this.include_companies_ids = data.value;
		this.refresh();
	}

	searchChange(data) {
	}


}
