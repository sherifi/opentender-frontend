import {Component} from '@angular/core';
import {Consts} from '../../../model/consts';
import {IIndicatorInfo} from '../../../app.interfaces';
import {Utils} from '../../../model/utils';

@Component({
	moduleId: __filename,
	selector: 'procurement-integrity',
	templateUrl: 'procurement-integrity.component.html'
})
export class DashboardsIntegrityPage {
	public indicator: IIndicatorInfo = Utils.indicatorInfo(Consts.indicators.CORRUPTION);
	public columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name', 'indicators.pii'];
}
