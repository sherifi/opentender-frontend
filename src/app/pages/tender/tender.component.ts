import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {PlatformService} from '../../services/platform.service';
import {ConfigService, Country} from '../../services/config.service';
import {Consts} from '../../model/consts';
import {NotifyService} from '../../services/notify.service';

@Component({
	moduleId: __filename,
	selector: 'tender',
	templateUrl: 'tender.template.html'
})
export class TenderPage implements OnInit, OnDestroy {
	public tender: Definitions.Tender;
	public tender_raw: string;
	private loading: number = 0;
	private sub: any;
	public portal: Country;
	public state = {
		lots: {$open: true},
		buyer: {$open: true},
		indi: {$open: true},
		info: {$open: true},
		desc: {$open: true},
		reqs: {$open: false},
		additional: {$open: false},
		documents: {$open: false},
		publications: {$open: false},
		raw: {$open: false},
		discussion: {$open: false},
	};
	public indicators = {
		cr: [],
		tr: [],
		ac: []
	};

	constructor(private route: ActivatedRoute, private api: ApiService, private config: ConfigService, private platform: PlatformService, private notify: NotifyService) {
		if (!this.platform.isBrowser) {
			this.state.additional.$open = true;
			this.state.documents.$open = true;
			this.state.publications.$open = true;
			this.state.reqs.$open = true;
			this.state.raw.$open = true;
			this.state.discussion.$open = true;
		}
		this.portal = config.country;
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

		this.indicators.ac = [];
		this.indicators.cr = [];
		this.indicators.tr = [];
		if (tender.indicators) {
			tender.indicators.forEach(indicator => {
				if (indicator.type.indexOf(Consts.indicators.ac.prefix) === 0) {
					this.indicators.ac.push(indicator);
				} else if (indicator.type.indexOf(Consts.indicators.cr.prefix) === 0) {
					this.indicators.cr.push(indicator);
				} else if (indicator.type.indexOf(Consts.indicators.tr.prefix) === 0) {
					this.indicators.tr.push(indicator);
				}
			});
		}

		this.tender_raw = JSON.stringify(tender, null, '\t');
	}

}
