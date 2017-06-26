import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {SearchCommand} from '../../model/search';
import {TitleService} from '../../services/title.service';
import Body = Definitions.Body;
import Buyer = Definitions.Buyer;
import {StateService} from '../../services/state.service';
import {IChartBar, IChartPie} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {IAuthority, IStats, ICompany} from '../../app.interfaces';
import {Consts} from '../../model/consts';
import {CountryService, Country} from '../../services/country.service';
import {Utils} from '../../model/utils';

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
					defaultHeight: 20,
					tickFormatting: Utils.formatYear
				},
				yAxis: {
					show: true,
					showLabel: true,
					label: 'Number of Bids',
					defaultWidth: 30,
					minInterval: 1,
					tickFormatting: Utils.formatValue
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
				valueFormatting: Utils.formatPercent,
				labels: true,
				explodeSlices: false,
				doughnut: false,
				gradient: false,
				colorScheme: {
					domain: Consts.colors.diverging
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
		buyers: Array<IAuthority>,
		lots_total: number,
		tenders_total: number,
		bids_total: number,
		bids_awarded: number,
	} = {
		sum_prices: [],
		buyers: [],
		lots_total: 0,
		tenders_total: 0,
		bids_total: 0,
		bids_awarded: 0
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
		this.api.getCompanyStats(ids).subscribe(
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

	display(data: {company: ICompany}): void {
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
	};

	displaySimilar(data: {similar: Array<ICompany>}): void {
		if (!data.similar) {
			return;
		}
		this.similar = data.similar;
	}

	displayStats(data: {stats: IStats}): void {
		if (!data.stats) {
			return;
		}
		let stats = data.stats;
		let vis = {
			sum_prices: [],
			buyers: [],
			lots_total: 0,
			tenders_total: 0,
			bids_total: 0,
			bids_awarded: 0
		};

		this.charts.cpvs_code_main.data = [];
		if (stats.cpvs) {
			Object.keys(stats.cpvs).forEach(key => {
				this.charts.cpvs_code_main.data.push({name: stats.cpvs[key].name, value: stats.cpvs[key].value});
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
		if (stats.counts) {
			vis.bids_awarded = stats.counts.bids_awarded;
			vis.bids_total = stats.counts.bids;
			vis.lots_total = stats.counts.lots;
			vis.tenders_total = stats.counts.tenders;
		}
		if (stats.buyers) {
			vis.buyers = stats.buyers.top10;
		}
		this.vis = vis;
	}

	searchChange(data) {
	}

	plain(o) {
		return JSON.stringify(o, null, '\t');
	}

}
