import {Component, Input} from '@angular/core';
import {Utils} from '../../model/utils';
import {ISeries, ISeriesDataTable, ISeriesProvider} from '../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'graph-footer',
	templateUrl: 'graph-footer.component.html',
	styleUrls: ['graph-footer.component.scss']
})
export class GraphFooterComponent {
	@Input()
	sender: ISeriesProvider;
	showDialog: boolean = false;
	series: ISeries;
	table: ISeriesDataTable;
	@Input()
	infoRouterLink: string | Array<string>;
	@Input()
	infoPageScroll: string;
	@Input()
	gradientLegend: { valueLow: number; valueHigh: number; colorLow: string; colorHigh: string; };

	constructor() {
	}

	show(): void {
		this.series = this.sender.getSeriesInfo();
		this.table = Utils.seriesToTable(this.series.data, this.series.header, this.series.multi);
		this.showDialog = true;
	}

	download(format): void {
		this.showDialog = false;
		Utils.downloadSeries(format, this.series.data, this.series.header, this.series.multi, this.series.filename);
	}
}
