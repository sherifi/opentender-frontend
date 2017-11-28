import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {TitleService} from '../../services/title.service';
import {StateService} from '../../services/state.service';
import {IAuthority, IStats, IStatsCompanies, IStatsCpvs, ISearchCommand, IStatsNuts, IStatsPricesInYears} from '../../app.interfaces';
import {ConfigService, Country} from '../../services/config.service';
import {NotifyService} from '../../services/notify.service';

/// <reference path="./model/tender.d.ts" />
import Buyer = Definitions.Buyer;
import {I18NService} from '../../services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'authority',
	templateUrl: 'authority.template.html'
})
export class AuthorityPage implements OnInit, OnDestroy {
	public authority: Buyer;
	public country: Country;
	public loading: number = 0;
	public search_cmd: ISearchCommand;
	public columnIds = ['id', 'title', 'titleEnglish', 'lots.bids.bidders.name', 'finalPrice'];
	private subscription: any;
	private include_authorities_ids: Array<string> = [];
	public similar: Array<Body> = [];

	private viz: {
		top_companies: { data: { absolute: IStatsCompanies, volume: IStatsCompanies }, title?: string };
		cpvs_codes: { data: IStatsCpvs, title?: string };
		company_nuts: { data: IStatsNuts, title?: string };
		lots_in_years: { data: IStatsPricesInYears, title?: string };
	} = {
		top_companies: {data: null},
		cpvs_codes: {data: null},
		company_nuts: {data: null},
		lots_in_years: {data: null}
	};

	constructor(private route: ActivatedRoute, private api: ApiService, private titleService: TitleService,
				private state: StateService, private i18n: I18NService, private config: ConfigService, private notify: NotifyService) {
		this.country = config.country;
		this.viz.top_companies.title = i18n.get('Main Suppliers');
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
		let viz = this.viz;
		Object.keys(viz).forEach(key => {
			viz[key].data = null;
		});
		if (!data || !data.stats) {
			return;
		}
		let stats = data.stats;
		viz.lots_in_years.data = stats.histogram_finalPriceEUR;
		viz.cpvs_codes.data = stats.terms_main_cpv_divisions;
		viz.top_companies.data = {absolute: stats.top_terms_companies, volume: stats.top_sum_finalPrice_companies};
		viz.company_nuts.data = stats.terms_company_nuts;
	}

	search(ids: Array<string>) {
		this.search_cmd = {
			filters: [
				{
					field: 'buyers.id',
					type: 'term',
					value: ids
				}
			]
		};
	}

	similarChange(data) {
		this.include_authorities_ids = data.value;
		this.refresh();
	}

	searchChange(data) {
	}


}
