import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {PlatformService} from '../../services/platform.service';
import {ConfigService, Country} from '../../services/config.service';
import {Consts} from '../../model/consts';
import {NotifyService} from '../../services/notify.service';
import {Utils} from '../../model/utils';
import {I18NService} from '../../services/i18n.service';
import {Subscription} from 'rxjs/Subscription';
import {ISearchFilterDefType, IStats} from '../../app.interfaces';
import {IndicatorService} from '../../services/indicator.service';

@Component({
	moduleId: __filename,
	selector: 'tender',
	templateUrl: 'tender.component.html',
	styleUrls: ['tender.component.scss']
})
export class TenderPage implements OnInit, OnDestroy {
	public tender: Definitions.Tender;
	public loading: number = 0;
	private subscription: Subscription;
	public showDownloadDialog: boolean = false;
	public portal: Country;
	public state: { [name: string]: { open: boolean, label?: string } } = {
		lots: {open: true},
		buyer: {open: true},
		indi: {open: true},
		info: {open: true},
		desc: {open: true},
		reqs: {open: false},
		additional: {open: false},
		documents: {open: false},
		publications: {open: false},
	};
	public viz = {
		indicators: {
			CORRUPTION: {data: []},
			TRANSPARENCY: {data: []},
			ADMINISTRATIVE: {data: []}
		},
		scores: {
			TENDER: {data: [], title: ''},
			CORRUPTION: {data: [], title: ''},
			TRANSPARENCY: {data: [], title: ''},
			ADMINISTRATIVE: {data: [], title: ''}
		},
		distribution: {
			data: null,
			highlight: {
				year: null,
				values: null
			},
			title: '',
			filters: [
				{id: 'cpvs', name: '', active: false},
				{id: 'nuts', name: '', active: false}
			]
		}
	};

	constructor(private route: ActivatedRoute, private api: ApiService, private config: ConfigService, private platform: PlatformService,
				private notify: NotifyService, private i18n: I18NService, private indicators: IndicatorService) {
		if (!this.platform.isBrowser) {
			this.state.additional.open = true;
			this.state.documents.open = true;
			this.state.publications.open = true;
			this.state.reqs.open = true;
		}
		this.viz.distribution.title = i18n.get('Benchmark');
		this.viz.distribution.filters[0].name = i18n.get('Limit to same sector');
		this.viz.distribution.filters[1].name = i18n.get('Limit to same region (NUTS2)');
		this.state.lots.label = this.i18n.get('Lots');
		this.state.buyer.label = this.i18n.get('Buyer');
		this.state.indi.label = this.i18n.get('Indicators');
		this.state.info.label = this.i18n.get('Tender Information');
		this.state.desc.label = this.i18n.get('Description');
		this.state.reqs.label = this.i18n.get('Requirements');
		this.state.additional.label = this.i18n.get('Additional Information');
		this.state.documents.label = this.i18n.get('Documents');
		this.state.publications.label = this.i18n.get('Publications');
		this.viz.scores.TENDER.title = this.i18n.get('Good Procurement Score');
		this.viz.scores.ADMINISTRATIVE.title = this.i18n.get('Administrative Capacity Score');
		this.viz.scores.TRANSPARENCY.title = this.i18n.get('Transparency Score');
		this.viz.scores.CORRUPTION.title = this.i18n.get('Procurement Integrity Score');
		this.portal = config.country;
	}

	getLotCollapse(lot, index) {
		let result = (this.state['lot' + index]);
		if (!result) {
			result = {
				open: !this.platform.isBrowser,
				label: this.i18n.get('Lot') + ' ' + (index + 1)
			};
			this.state['lot' + index] = result;
		}
		return result;
	}

	ngOnInit(): void {
		this.subscription = this.route.params.subscribe(params => {
			let id = params['id'];
			this.loading++;
			let sub = this.api.getTender(id).subscribe(
				(result) => this.display(result.data),
				(error) => {
					this.notify.error(error);
				},
				() => {
					this.loading--;
					sub.unsubscribe();
				});
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	display(tender: Definitions.Tender): void {
		this.tender = tender;
		let vals = {};
		Object.keys(this.viz.scores).forEach(key => this.viz.scores[key].data = []);
		Object.keys(this.viz.indicators).forEach(key => this.viz.indicators[key].data = []);
		if (tender.indicators) {
			tender.indicators.forEach(indicator => {
				if (indicator.status === 'CALCULATED') {
					vals[indicator.type] = indicator.value;
					const ig = this.indicators.getGroupOf(indicator.type);
					const ii = this.indicators.getIndicatorInfo(indicator.type);
					if (ig && ii) {
						this.viz.indicators[ig.id].data.push({id: indicator.type, name: ii.name, value: indicator.value, color: Consts.colors.indicators[ig.id]});
					}
				}
			});
		}
		if (tender.scores) {
			tender.scores.forEach(score => {
				if (score.status === 'CALCULATED') {
					vals[score.type] = score.value;
					const ig = score.type == 'TENDER' ? this.indicators.TENDER : this.indicators.getGroupOf(score.type);
					if (ig) {
						this.viz.scores[ig.id].data.push({id: score.type, name: ig.name, value: score.value, color: Consts.colors.indicators[score.type]});
					}
				}
			});
		}
		this.viz.distribution.highlight.values = vals;
		if (tender.date) {
			this.viz.distribution.highlight.year = tender.date.slice(0, 4);
		}
		this.refresh();
	}

	refresh(): void {
		if (!this.tender) {
			return;
		}
		let filters = [];
		if (this.viz.distribution.filters[0].active && this.tender.cpvs && this.tender.cpvs.length > 0) {
			filters.push({
				field: 'cpvs.code.divisions', type: ISearchFilterDefType[ISearchFilterDefType.term], value: [this.tender.cpvs[0].code.slice(0, 2)], and: [
					{field: 'cpvs.isMain', type: ISearchFilterDefType[ISearchFilterDefType.bool], value: [true]}
				]
			});
		}
		if (this.viz.distribution.filters[1].active && this.tender.buyers && this.tender.buyers.length > 0 && this.tender.buyers[0].address && this.tender.buyers[0].address.nutscode) {
			let level = 3;
			filters.push({
				field: 'buyers.address.nutscode.nuts' + level, type: ISearchFilterDefType[ISearchFilterDefType.term],
				value: [this.tender.buyers[0].address.nutscode.slice(0, 2 + level)]
			});
		}
		let sub = this.api.getTenderStats({ids: [this.tender.id], filters: filters}).subscribe(
			(result) => this.displayStats(result.data),
			(error) => {
				this.notify.error(error);
			},
			() => {
				sub.unsubscribe();
			});
	}

	displayStats(data: { stats: IStats }): void {
		let viz = this.viz;
		viz.distribution.data = null;
		if (!data || !data.stats) {
			return;
		}
		let stats = data.stats;
		viz.distribution.data = stats.histogram_distribution_indicators;
	}

	benchmarkFilterChange(event) {
		this.refresh();
	}

	getTenderJSONString(): string {
		return JSON.stringify(this.tender, null, '\t');
	}

	download(format): void {
		Utils.downloadJSON(this.tender, 'tender-' + this.tender.id);
	}

}
