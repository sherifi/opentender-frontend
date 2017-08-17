import {Component} from '@angular/core';
import {I18NService} from '../../../services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'administrative-capacity',
	templateUrl: 'administrative-capacity.template.html'
})
export class DashboardsAdministrativeCapacityPage {
	public columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name', 'indicators.aci'];
	public indicator: string;
	public searchPrefix = 'ADMINISTRATIVE';

	constructor(i18n: I18NService) {
		this.indicator = i18n.get('Administrative Capacity Indicators');
	}
}
