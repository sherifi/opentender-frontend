import {Component} from '@angular/core';
import {SearchCommand, SearchCommandFilter} from '../../../model/search';
import {ApiService} from '../../../services/api.service';
import {IStats, IStatsPcCpvs, IStatsIndicators, IStatsPcLotsInYears} from '../../../app.interfaces';
import {Consts} from '../../../model/consts';
import {IChartBar, IChartPie} from '../../../thirdparty/ngx-charts-universal/chart.interface';
import {Utils} from '../../../model/utils';

@Component({
	moduleId: __filename,
	selector: 'corruption-risk',
	templateUrl: 'corruption-risk.template.html'
})
export class DashboardsCorruptionPage {
	public columnIds = ['id', 'title', 'buyers.name', 'lots.bids.bidders.name', 'indicators.cri'];
	public indicator: string = 'Corruption Risk Indicators';
	public searchPrefix: string = 'CORRUPTION';
}
