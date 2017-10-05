import {Component} from '@angular/core';
import {Consts} from '../../../model/consts';
import {IndicatorInfo} from '../../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'corruption-risk',
	templateUrl: 'corruption-risk.template.html'
})
export class DashboardsCorruptionPage {
	public indicator: IndicatorInfo = Consts.indicators.CORRUPTION;
	public columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name', 'indicators.cri'];
}
