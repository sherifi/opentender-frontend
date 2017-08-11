import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Utils} from '../../model/utils';
import {CountryService} from '../../services/country.service';

interface Download {
	country: string;
	filename: string;
	name: string;
	count: number;
	size: number;
}

@Component({
	moduleId: __filename,
	selector: 'downloads',
	templateUrl: 'downloads.template.html'
})
export class DownloadsPage implements OnInit {
	downloads: Array<Download> = [];
	current: Download;

	constructor(private api: ApiService, private countryService: CountryService) {

	}

	public ngOnInit(): void {
		this.refresh();
	}

	refresh() {
		let current_id = this.countryService.get().id || 'eu';
		this.api.getDownloads().subscribe(
			(data: any) => {
				data.forEach(download => {
					download.name = Utils.expandCountry(download.country);
					if (download.country === current_id) {
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
