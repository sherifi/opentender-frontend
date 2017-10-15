import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Utils} from '../../model/utils';
import {ConfigService} from '../../services/config.service';

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
	templateUrl: 'download.template.html'
})
export class DownloadPage implements OnInit {
	downloads: Array<Download> = [];
	current: Download;

	constructor(private api: ApiService, private config: ConfigService) {

	}

	public ngOnInit(): void {
		this.refresh();
	}

	refresh() {
		let current_id = this.config.country.id || 'eu';
		this.api.getDownloads().subscribe(
			(data: any) => {
				data.forEach(download => {
					download.name = Utils.expandCountry(download.country);
					if (download.country === current_id && download.count > 0) {
						this.current = download;
					}
				});
				data = data.filter(download => {
					return (this.current !== download) && (download.count > 0);
				});
				data = data.sort((a, b) => {
					if (a.name < b.name) return -1;
					if (a.name > b.name) return 1;
					return 0;
				});
				this.downloads = data;
			},
			error => console.error(error),
			() => {
				// console.log('getDownloads complete');
			});
	}
}
