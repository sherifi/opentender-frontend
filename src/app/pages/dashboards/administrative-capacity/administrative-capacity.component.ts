import {Component} from '@angular/core';
import {IIndicatorInfo} from '../../../app.interfaces';
import {IndicatorService} from '../../../services/indicator.service';

@Component({
	moduleId: __filename,
	selector: 'administrative-capacity',
	templateUrl: 'administrative-capacity.component.html'
})
export class DashboardsAdministrativeCapacityPage {
	public indicator: IIndicatorInfo;
	public columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name', 'indicators.aci'];

	constructor(indicators: IndicatorService) {
		this.indicator = indicators.ADMINISTRATIVE;
	}
}
