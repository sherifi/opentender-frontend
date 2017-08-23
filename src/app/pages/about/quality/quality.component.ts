import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {IUsageEntry} from '../../../app.interfaces';
import {NotifyService} from '../../../services/notify.service';

interface QualityEntry {
	field: string;
	available: number;
	missing: number;
	total: number;
	missing_percent: number;
	available_percent: number;
}

@Component({
	moduleId: __filename,
	selector: 'quality',
	templateUrl: 'quality.template.html'
})
export class AboutDataQualityPage implements OnInit {
	usage: Array<QualityEntry>;
	data: Array<QualityEntry>;
	showEmpty = false;
	loading: number = 0;

	constructor(private api: ApiService, private notify: NotifyService) {
	}

	ngOnInit() {
		this.loading++;
		this.api.getFieldsUsage().subscribe(
			(result) => {
				this.display(result.data);
			},
			(error) => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
			});
	}

	display(data: Array<IUsageEntry>) {
		this.data = data.map((u: IUsageEntry) => {
			let total = u.missing + u.available;
			return {
				field: u.field,
				missing: u.missing,
				available: u.available,
				total: total,
				missing_percent: ( total == 0 ? 100 : u.missing / (total / 100)),
				available_percent: (total == 0 ? 0 : u.available / (total / 100))
			};
		});
		this.refresh();
	}

	refresh() {
		this.usage = this.data.filter((u: QualityEntry) => {
			return (this.showEmpty || (u.missing !== u.total));
		});
	}

}
