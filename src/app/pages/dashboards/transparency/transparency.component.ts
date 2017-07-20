import {Component} from '@angular/core';
import {SearchCommand, SearchCommandFilter} from '../../../model/search';
import {ApiService} from '../../../services/api.service';
import {IStats} from '../../../app.interfaces';
import {Consts} from '../../../model/consts';
import {IChartBar, IChartPie} from '../../../thirdparty/ngx-charts-universal/chart.interface';
import {Utils} from '../../../model/utils';

@Component({
	moduleId: __filename,
	selector: 'transparency',
	templateUrl: 'transparency.template.html'
})
export class DashboardsTransparencyPage {
	public columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name', 'indicators.ti'];
	public indicator: string = 'Transparency Indicators';
	public searchPrefix = 'TRANSPARENCY';
}
