import {Component} from '@angular/core';
import {Consts} from '../../../model/consts';
import {IIndicatorInfo} from '../../../app.interfaces';
import {Utils} from '../../../model/utils';

@Component({
	moduleId: __filename,
	selector: 'transparency',
	templateUrl: 'transparency.component.html'
})
export class DashboardsTransparencyPage {
	public indicator: IIndicatorInfo = Utils.indicatorInfo(Consts.indicators.TRANSPARENCY);
	public columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name', 'indicators.ti'];
}
