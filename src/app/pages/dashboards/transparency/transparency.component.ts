import {Component} from '@angular/core';
import {Consts} from '../../../model/consts';
import {IndicatorInfo} from '../../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'transparency',
	templateUrl: 'transparency.template.html'
})
export class DashboardsTransparencyPage {
	public indicator: IndicatorInfo = Consts.indicators.TRANSPARENCY;
	public columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name', 'indicators.ti'];
}
