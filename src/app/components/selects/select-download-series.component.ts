import {Component, Input} from '@angular/core';
import {Utils} from '../../model/utils';

@Component({
	moduleId: __filename,
	selector: 'select-series-download-button',
	templateUrl: 'select-download-series.component.html'
})
export class SelectDownloadSeriesComponent {
	@Input()
	sender: any;

	constructor() {

	}

	download(format): void {
		let info = this.sender.getSeriesInfo();
		Utils.downloadSeries(format, info.data, info.header, info.filename);
	}
}
