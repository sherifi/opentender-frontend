import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {SearchCommand} from '../../model/search';
import {TitleService} from '../../services/title.service';
import Buyer = Definitions.Buyer;
import Body = Definitions.Body;
import {StateService} from '../../services/state.service';
import {IChartBar, IChartPie} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {ICompany, IAuthority, IStats} from '../../app.interfaces';
import {Consts} from '../../model/consts';
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

	private charts: {
		bids_in_years: IChartBar;
		cpvs_code_main: IChartPie;
	} = {
		bids_in_years: {
			visible: false,
			chart: {
				schemeType: 'ordinal',
				view: {
					def: {width: 470, height: 320},
					min: {height: 320},
					max: {height: 320}
				},
				xAxis: {
					show: true,
					showLabel: true,
					label: 'Year',
					defaultHeight: 20
				},
				yAxis: {
					show: true,
					showLabel: true,
					label: 'Number of Bids',
					defaultWidth: 30,
					minInterval: 1
				},
				showGridLines: true,
				gradient: false,
				colorScheme: {
					domain: Consts.colors.single
				}
			},
			select: (event) => {
			},
			onLegendLabelClick: (event) => {
			},
			data: []
		},
		cpvs_code_main: {
			visible: false,
			chart: {
				schemeType: 'ordinal',
				view: {
					def: {width: 470, height: 320},
					min: {height: 320},
					max: {height: 320}
				},
				labels: true,
				explodeSlices: false,
				doughnut: false,
				gradient: false,
				colorScheme: {
					'domain': Consts.colors.diverging
				}
			},
			select: (event) => {
			},
			onLegendLabelClick: (event) => {
			},
			data: []
		}
	};

	private vis: {
		sum_prices: Array<{currency: string, value: number}>,
		suppliers: Array<ICompany>,
		tenders_total: number,
		lots_total: number,
		bids_total: number,
		bids_awarded: number
	} = {
		sum_prices: [],
		suppliers: [],
		tenders_total: 0,
		lots_total: 0,
		bids_total: 0,
		bids_awarded: 0
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

	display(data: {authority: IAuthority}): void {
		if (data && data.authority) {
			this.authority = data.authority.body;
			this.titleService.set(this.authority.name);
			this.getSimilars(this.authority.groupId);
			this.refresh();
		}
	}

	getStats(ids: Array<string>) {
		this.api.getAuthorityStats(ids).subscribe(
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

	displaySimilar(data: {similar: Array<IAuthority>}): void {
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

	displayStats(data: {stats: IStats}): void {
		if (!data.stats) {
			return;
		}
		let stats = data.stats;
		let vis = {
			sum_prices: [],
			suppliers: [],
			tenders_total: 0,
			lots_total: 0,
			bids_total: 0,
			bids_awarded: 0
		};

		this.charts.cpvs_code_main.data = [];
		if (stats.cpvs) {
			this.charts.cpvs_code_main.data = Object.keys(stats.cpvs).map(key => {
				return {name: stats.cpvs[key].name, value: stats.cpvs[key].value};
			});
		}
		this.charts.cpvs_code_main.visible = this.charts.cpvs_code_main.data.length > 0;

		this.charts.bids_in_years.data = [];
		if (stats.bids_in_years) {
			this.charts.bids_in_years.data = Object.keys(stats.bids_in_years).map((key) => {
				return {name: key, value: stats.bids_in_years[key]};
			});
		}
		this.charts.bids_in_years.visible = this.charts.bids_in_years.data.length > 0;

		if (stats.sum_price) {
			Object.keys(stats.sum_price).forEach(key => {
				if (stats.sum_price[key] > 0) {
					vis.sum_prices.push({currency: key.toString().toUpperCase(), value: stats.sum_price[key]});
				}
			});
		}
		if (stats.suppliers) {
			vis.suppliers = stats.suppliers.top10;
		}
		if (stats.counts) {
			vis.bids_awarded = stats.counts.bids_awarded;
			vis.bids_total = stats.counts.bids;
			vis.lots_total = stats.counts.lots;
			vis.tenders_total = stats.counts.tenders;
		}
		this.vis = vis;
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
	};

	searchChange(data) {
	}

	plain(o) {
		return JSON.stringify(o, null, '\t');
	}

}
