import {Component} from '@angular/core';
import {Consts} from '../../../model/consts';
import {IIndicatorInfo} from '../../../app.interfaces';
import {Utils} from '../../../model/utils';
import {IndicatorService} from '../../../services/indicator.service';

@Component({
	moduleId: __filename,
	selector: 'transparency',
	templateUrl: 'transparency.component.html'
})
export class DashboardsTransparencyPage {
	public indicator: IIndicatorInfo;
	public columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name', 'indicators.ti'];

	constructor(indicators: IndicatorService) {
		this.indicator = indicators.TRANSPARENCY;
	}
}
