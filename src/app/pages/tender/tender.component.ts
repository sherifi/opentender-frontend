import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {PlatformService} from '../../services/platform.service';
import {ConfigService, Country} from '../../services/config.service';
import {Consts} from '../../model/consts';
import {NotifyService} from '../../services/notify.service';
import {Utils} from '../../model/utils';
import {I18NService} from '../../services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'tender',
	templateUrl: 'tender.template.html'
})
export class TenderPage implements OnInit, OnDestroy {
	public tender: Definitions.Tender;
	public loading: number = 0;
	private sub: any;
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
	public indicators = {
		CORRUPTION: [],
		TRANSPARENCY: [],
		ADMINISTRATIVE: []
	};
	public scores = {
		TENDER: [],
		CORRUPTION: [],
		TRANSPARENCY: [],
		ADMINISTRATIVE: []
	};

	constructor(private route: ActivatedRoute, private api: ApiService, private config: ConfigService, private platform: PlatformService, private notify: NotifyService, private i18n: I18NService) {
		if (!this.platform.isBrowser) {
			this.state.additional.open = true;
			this.state.documents.open = true;
			this.state.publications.open = true;
			this.state.reqs.open = true;
		}
		this.state.lots.label = this.i18n.get('Lots');
		this.state.buyer.label = this.i18n.get('Buyer');
		this.state.indi.label = this.i18n.get('Indicators');
		this.state.info.label = this.i18n.get('Tender Information');
		this.state.desc.label = this.i18n.get('Description');
		this.state.reqs.label = this.i18n.get('Requirements');
		this.state.additional.label = this.i18n.get('Additional Information');
		this.state.documents.label = this.i18n.get('Documents');
		this.state.publications.label = this.i18n.get('Publications');
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
		this.sub = this.route.params.subscribe(params => {
			let id = params['id'];
			this.loading++;
			this.api.getTender(id).subscribe(
				(result) => this.display(result.data),
				(error) => {
					this.notify.error(error);
				},
				() => {
					this.loading--;
				});
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	display(tender: Definitions.Tender): void {
		this.tender = tender;
		this.indicators.ADMINISTRATIVE = [];
		this.indicators.CORRUPTION = [];
		this.indicators.TRANSPARENCY = [];
		this.scores.TENDER = [];
		this.scores.ADMINISTRATIVE = [];
		this.scores.CORRUPTION = [];
		this.scores.TRANSPARENCY = [];
		if (tender.indicators) {
			tender.indicators.forEach(indicator => {
				if (indicator.status === 'CALCULATED') {
					Object.keys(Consts.indicators).forEach(key => {
						if (indicator.type.indexOf(key) === 0) {
							let groupkey = key.split('_')[0];
							this.indicators[key].push({id: indicator.type, name: Utils.formatIndicatorName(indicator.type), value: indicator.value, color: Consts.colors.indicators[groupkey]});
						}
					});
				}
			});
		}
		if (tender.scores) {
			tender.scores.forEach(score => {
				if (score.status === 'CALCULATED') {
					Object.keys(this.scores).forEach(key => {
						if (score.type === key) {
							this.scores[key].push({id: score.type, name: Utils.formatIndicatorGroupName(score.type), value: score.value, color: Consts.colors.indicators[score.type]});
						}
					});
				}
			});
		}
	}

	getTenderJSONString(): string {
		return JSON.stringify(this.tender, null, '\t');
	}

	download(format): void {
		Utils.downloadJSON(this.tender, 'tender-' + this.tender.id);
	}

}
