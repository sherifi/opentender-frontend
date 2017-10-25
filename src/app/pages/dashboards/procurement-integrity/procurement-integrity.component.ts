import {Component} from '@angular/core';
import {Consts} from '../../../model/consts';
import {IndicatorInfo} from '../../../app.interfaces';
import {Utils} from '../../../model/utils';

@Component({
	moduleId: __filename,
	selector: 'procurement-integrity',
	templateUrl: 'procurement-integrity.template.html'
})
export class DashboardsIntegrityPage {
	public indicator: IndicatorInfo = Utils.indicatorInfo(Consts.indicators.CORRUPTION);
	public columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name', 'indicators.pii'];
}
