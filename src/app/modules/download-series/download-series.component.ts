import {Component, Input} from '@angular/core';
import {Utils} from '../../model/utils';
import {ISeries, ISeriesProvider} from '../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'series-download-button',
	templateUrl: 'download-series.component.html',
	styleUrls: ['download-series.component.scss']
})
export class SelectDownloadSeriesComponent {
	@Input()
	sender: ISeriesProvider;
	showDialog: boolean = false;
	series: ISeries;
	table: {
		head: Array<string>;
		rows: Array<Array<string | number | Date>>;
	};

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
