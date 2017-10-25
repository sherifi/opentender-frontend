import {Component} from '@angular/core';
import {Consts} from '../../../model/consts';
import {IndicatorInfo} from '../../../app.interfaces';
import {Utils} from '../../../model/utils';

@Component({
	moduleId: __filename,
	selector: 'administrative-capacity',
	templateUrl: 'administrative-capacity.template.html'
})
export class DashboardsAdministrativeCapacityPage {
	public indicator: IndicatorInfo = Utils.indicatorInfo(Consts.indicators.ADMINISTRATIVE);
	public columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name', 'indicators.aci'];
}
