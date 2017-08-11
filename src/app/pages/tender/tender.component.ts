import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {Country, CountryService} from '../../services/country.service';
import {PlatformService} from '../../services/platform.service';

@Component({
	moduleId: __filename,
	selector: 'tender',
	templateUrl: 'tender.template.html'
})
export class TenderPage implements OnInit, OnDestroy {
	public tender: Definitions.Tender;
	public tender_raw: string;
	private sub: any;
	public portal: Country;
	public state = {
		lots: {$open: true},
		buyer: {$open: true},
		info: {$open: true},
		desc: {$open: true},
		additional: {$open: false},
		documents: {$open: false},
		publications: {$open: false},
		raw: {$open: false},
		discussion: {$open: false},
	};

	constructor(private route: ActivatedRoute, private api: ApiService, private country: CountryService, private platform: PlatformService) {
		if (!this.platform.isBrowser) {
			this.state.additional.$open = true;
			this.state.documents.$open = true;
			this.state.publications.$open = true;
			this.state.raw.$open = true;
			this.state.discussion.$open = true;
		}
		this.portal = country.get();
	}

	ngOnInit(): void {
		this.sub = this.route.params.subscribe(params => {
			let id = params['id'];
			this.api.getTender(id).subscribe(
				(result) => this.display(result.data),
				error => console.error(error),
				() => {
					// console.log('getTender complete');
				});
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	display(tender: Definitions.Tender): void {
		this.tender = tender;
		this.tender_raw = JSON.stringify(tender, null, '\t');
	}

}
