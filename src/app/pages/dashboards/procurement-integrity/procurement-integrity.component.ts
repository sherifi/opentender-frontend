import {Component} from '@angular/core';
import {Consts} from '../../../model/consts';
import {IndicatorInfo} from '../../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'procurement-integrity',
	templateUrl: 'procurement-integrity.template.html'
})
export class DashboardsIntegrityPage {
	public indicator: IndicatorInfo = Consts.indicators.CORRUPTION;
	public columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name', 'indicators.pii'];
}
