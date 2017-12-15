import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Utils} from '../../model/utils';
import {ConfigService} from '../../services/config.service';
import {I18NService} from '../../services/i18n.service';

interface Download {
	country: string;
	filename: string;
	name: string;
	count: number;
	size: number;
}

@Component({
	moduleId: __filename,
	selector: 'download',
	templateUrl: 'download.component.html',
	styleUrls: ['download.component.scss']
})
export class DownloadPage implements OnInit {
	downloads: Array<Download> = [];
	current: Download;

	constructor(private api: ApiService, private config: ConfigService, private i18n: I18NService) {

	}

	public ngOnInit(): void {
		this.refresh();
	}

	refresh() {
		let current_id = this.config.country.id || 'all';
		let sub = this.api.getDownloads().subscribe(
			(data: any) => {
				data.forEach(download => {
					download.name = this.i18n.expandCountry(download.country);
					if (download.country === current_id && download.count > 0) {
						this.current = download;
					}
				});
				data = data.filter(download => {
					return (download.count > 0);
				});
				data = data.sort((a, b) => {
					if (a.name < b.name) {
						return -1;
					}
					if (a.name > b.name) {
						return 1;
					}
					return 0;
				});
				this.downloads = data;
			},
			error => console.error(error),
			() => {
				sub.unsubscribe();
			});
	}
}
