import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {ConfigService} from '../../services/config.service';
import {I18NService} from '../../modules/i18n/services/i18n.service';
import {IBreadcrumb, IDownload, IDownloadCSV} from '../../app.interfaces';

interface Download extends IDownload {
	name: string;
}

interface CSVDownload extends IDownloadCSV {
	name: string;
}

@Component({
	moduleId: __filename,
	selector: 'download',
	templateUrl: 'download.component.html',
	styleUrls: ['download.component.scss']
})
export class DownloadPage implements OnInit {
	downloads: Array<Download> = [];
	downloads_csv: Array<CSVDownload> = [];
	current: Download;
	public crumbs: Array<IBreadcrumb> = [];

	constructor(private api: ApiService, private config: ConfigService, private i18n: I18NService) {
		this.crumbs = [{name: i18n.get('Download')}];
	}

	public ngOnInit(): void {
		this.refreshJSONDownloads();
		this.refreshCSVDownloads();
	}

	refreshCSVDownloads() {
		let sub = this.api.getCSVDownloads().subscribe(
			(data: Array<IDownloadCSV>) => {
				this.downloads_csv = data.map(download => {
					let country_code = download.filename.replace('_data.csv', '');
					return {
						name: this.i18n.getPortalName(country_code, this.i18n.expandCountry(country_code)),
						size: download.size,
						count: download.count,
						filename: download.filename
					}
				}).sort((a, b) => {
					return a.name.localeCompare(b.name);
				});
			},
			error => console.error(error),
			() => {
				sub.unsubscribe();
			});
	}

	refreshJSONDownloads() {
		let current_id = this.config.country.id || 'all';
		let sub = this.api.getDownloads().subscribe(
			(data: Array<IDownload>) => {
				this.downloads = data.filter(download => {
					return (download.count > 0);
				}).map(download => {
					let result: Download = {
						name: download.country,
						country: download.country,
						formats: download.formats,
						count: download.count
					};
					if (result.country === 'eu') {
						result.name = this.i18n.get('EU Institutions');
					} else if (result.country === 'all') {
						result.name = this.i18n.get('All Data');
					} else {
						result.name = this.i18n.getPortalName(result.country.toUpperCase(), this.i18n.expandCountry(result.country));
					}
					if (result.country === current_id && result.count > 0) {
						this.current = result;
					}
					return result;
				}).sort((a, b) => {
					if (a.country === 'all') {
						return -1;
					}
					if (b.country === 'all') {
						return 1;
					}
					return a.name.localeCompare(b.name);
				});
			},
			error => console.error(error),
			() => {
				sub.unsubscribe();
			});
	}
}
