import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {IUsageEntry} from '../../../app.interfaces';

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
export class DocumentationQualityPage implements OnInit {
	usage: Array<QualityEntry>;
	data: Array<QualityEntry>;
	showEmpty = false;
	isLoading = false;

	constructor(private api: ApiService) {
	}

	ngOnInit() {
		this.isLoading = true;
		this.api.getUsage().subscribe(
			(result) => {
				this.isLoading = false;
				this.display(result.data);
			},
			error => {
				this.isLoading = false;
				console.error(error);
			},
			() => {
				this.isLoading = false;
				// console.log('getQuality complete');
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
