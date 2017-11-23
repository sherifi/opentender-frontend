import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {TitleService} from '../../services/title.service';
import {StateService} from '../../services/state.service';
import {ConfigService, Country} from '../../services/config.service';
import {IStats, ICompany, IStatsCpvs, ISearchCommand, IStatsAuthorities, IStatsNuts, IStatsPricesLotsInYears} from '../../app.interfaces';
import {NotifyService} from '../../services/notify.service';

/// <reference path="./model/tender.d.ts" />
import Body = Definitions.Body;
import {I18NService} from '../../services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'company',
	templateUrl: 'company.template.html'
})
export class CompanyPage implements OnInit, OnDestroy {
	public company: Body;
	public country: Country;
	public search_cmd: ISearchCommand;
	public columnIds = ['id', 'title', 'titleEnglish', 'buyers.name', 'finalPrice'];
	public similar: Array<Body> = [];
	public include_companies_ids: Array<string> = [];
	public loading: number = 0;
	private subscription: any;

	private viz: {
		authority_nuts: { data: IStatsNuts, title?: string };
		top_authorities: { data: { absolute: IStatsAuthorities, volume: IStatsAuthorities }, title?: string };
		cpvs_codes: { data: IStatsCpvs, title?: string };
		lots_in_years: { data: IStatsPricesLotsInYears, title?: string };
	} = {
		authority_nuts: {data: null},
		top_authorities: {data: null},
		cpvs_codes: {data: null},
		lots_in_years: {data: null}
	};

	constructor(private route: ActivatedRoute, private api: ApiService, private titleService: TitleService,
				private state: StateService, private i18n: I18NService, private config: ConfigService, private notify: NotifyService) {
		this.country = config.country;
		this.viz.top_authorities.title = i18n.get('Main Buyers');
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
		this.search_cmd = {
			filters: [
				{
					field: 'lots.bids.bidders.id',
					type: 'term',
					value: ids
				}
			]
		};
	}

	displaySimilar(data: { similar: Array<ICompany> }): void {
		if (!data.similar) {
			return;
		}
		this.similar = data.similar.map(company => company.body);
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
		viz.lots_in_years.data = stats.histogram_lots_awardDecisionDate_finalPrices;
		viz.cpvs_codes.data = stats.terms_main_cpv_divisions;
		viz.top_authorities.data = {absolute: stats.top_terms_authorities, volume: stats.top_sum_finalPrice_authorities};
		viz.authority_nuts.data = stats.terms_authority_nuts;
	}

	similarChange(data) {
		this.include_companies_ids = data.value;
		this.refresh();
	}

	searchChange(data) {
	}

}
