import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {SearchCommand, SearchCommandFilter} from '../../model/search';
import {TitleService} from '../../services/title.service';
import Body = Definitions.Body;
import Buyer = Definitions.Buyer;
import {StateService} from '../../services/state.service';
import {IChartBar, IChartPie} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {ISector, IStats} from '../../app.interfaces';
import {Consts} from '../../model/consts';

@Component({
	moduleId: __filename,
	selector: 'sector',
	templateUrl: 'sector.template.html'
})
export class SectorPage implements OnInit, OnDestroy {
	public sector: ISector;
	public parent_sector: ISector;
	public error: string;
	public search_cmd: SearchCommand;
	public columnIds = ['id', 'title', 'titleEnglish', 'buyers.name', 'lots.bids.bidders'];
	private subscription: any;
	vis: {
		subgroups: Array<any>,
		sum_prices: Array<any>,
		buyers: Array<any>,
		suppliers: Array<any>,
		tenders_total: number,
		lots_total: number,
		bids_total: number,
		bids_awarded: number
	} = {
		subgroups: [],
		sum_prices: [],
		buyers: [],
		suppliers: [],
		tenders_total: 0,
		lots_total: 0,
		bids_total: 0,
		bids_awarded: 0
	};

	private charts: {
		lots_in_years: IChartBar;
		cpvs_codes: IChartPie;
	} = {
		lots_in_years: {
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
					label: 'Number of Lots',
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
		cpvs_codes: {
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

	constructor(private route: ActivatedRoute, private api: ApiService, private titleService: TitleService, private state: StateService) {
	}

	ngOnInit(): void {
		let state = this.state.get('sector');
		if (state) {
			this.columnIds = state.columnIds;
		}
		this.subscription = this.route.params.subscribe(params => {
			let id = params['id'];
			this.api.getSector(id).subscribe(
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

	display(data: {sector: ISector, parent?: ISector, stats: IStats}): void {
		this.sector = null;
		this.parent_sector = null;
		if (data && data.sector) {
			this.sector = data.sector;
			this.titleService.set(data.sector.name);
		}
		if (data && data.parent) {
			this.parent_sector = data.parent;
		}
		if (data && data.stats) {
			this.displayStats(data.stats);
		}
		this.search();
	}

	displayStats(data: IStats): void {
		let vis = {
			subgroups: [],
			sum_prices: [],
			buyers: [],
			suppliers: [],
			tenders_total: 0,
			lots_total: 0,
			bids_total: 0,
			bids_awarded: 0
		};
		this.charts.cpvs_codes.data = [];
		if (data.cpvs) {
			this.charts.cpvs_codes.data = Object.keys(data.cpvs).map(key => {
				if (this.sector && key !== this.sector.id) {
					vis.subgroups.push({id: key, name: data.cpvs[key].name, value: data.cpvs[key].value});
				}
				return {name: data.cpvs[key].name, value: data.cpvs[key].value};
			});
		}
		this.charts.cpvs_codes.visible = this.charts.cpvs_codes.data.length > 0;

		this.charts.lots_in_years.data = [];
		if (data.lots_in_years) {
			this.charts.lots_in_years.data = Object.keys(data.lots_in_years).map((key, index) => {
				return {name: key, value: data.lots_in_years[key]};
			});
		}
		this.charts.lots_in_years.visible = this.charts.lots_in_years.data.length > 0;

		if (data.sum_price) {
			Object.keys(data.sum_price).forEach(key => {
				if (data.sum_price[key] > 0) {
					vis.sum_prices.push({currency: key.toString().toUpperCase(), value: data.sum_price[key]});
				}
			});
		}
		if (data.suppliers) {
			vis.suppliers = data.suppliers.top10;
		}
		if (data.buyers) {
			vis.buyers = data.buyers.top10;
		}
		if (data.counts) {
			vis.bids_awarded = data.counts.bids_awarded;
			vis.bids_total = data.counts.bids;
			vis.lots_total = data.counts.lots;
			vis.tenders_total = data.counts.tenders;
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
			field: this.sector.id.length === 2 ? 'cpvs.code.main' : 'cpvs.code',
			type: 'term',
			value: [this.sector.id],
			and: [subfilter]
		};
		let search_cmd = new SearchCommand();
		search_cmd.filters = [filter];
		this.search_cmd = search_cmd;
	};

	searchChange(data) {
	}

}
