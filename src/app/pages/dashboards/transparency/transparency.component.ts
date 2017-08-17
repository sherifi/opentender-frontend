import {Component} from '@angular/core';
import {I18NService} from '../../../services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'transparency',
	templateUrl: 'transparency.template.html'
})
export class DashboardsTransparencyPage {
	public columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name', 'indicators.ti'];
	public indicator: string;
	public searchPrefix = 'TRANSPARENCY';

	constructor(i18n: I18NService) {
		this.indicator = i18n.get('Transparency Indicators');
	}
}
