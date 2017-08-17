import {Component} from '@angular/core';
import {I18NService} from '../../../services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'corruption-risk',
	templateUrl: 'corruption-risk.template.html'
})
export class DashboardsCorruptionPage {
	public columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name', 'indicators.cri'];
	public indicator: string;
	public searchPrefix: string = 'CORRUPTION';

	constructor(i18n: I18NService) {
		this.indicator = i18n.get('Corruption Risk Indicators');
	}
}
