import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {ConfigService} from '../../services/config.service';
import {I18NService} from '../../modules/i18n/services/i18n.service';
import {IBreadcrumb, IDownload, IDownloadOCDS} from '../../app.interfaces';

interface Download extends IDownload {
	name: string;
}

interface OCDSDownload extends IDownloadOCDS {
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
	downloads_ocsd: Array<OCDSDownload> = [];
	current: {
		id: string;
		name: string;
		count?: number;
		formats: {
			ndjson?: {
				filename: string; size: number
			},
			json?: {
				filename: string; size: number
			},
			csv?: {
				filename: string; size: number
			},
			ocds?: {
				filename: string; size: number
			}
		}
	};
	public crumbs: Array<IBreadcrumb> = [];

	constructor(private api: ApiService, private config: ConfigService, private i18n: I18NService) {
		this.crumbs = [{name: i18n.get('Download')}];
		let current_id = this.config.country.id || 'all';
		this.current = {
			id: current_id.toUpperCase(),
			name: this.i18n.getPortalName(current_id.toUpperCase(), this.i18n.expandCountry(current_id)),
			formats: {}
		};
	}

	public ngOnInit(): void {
		this.refreshOCDSDownloads();
		this.refreshJSONDownloads();
	}

	refreshOCDSDownloads() {
		let sub = this.api.getOCDSDownloads().subscribe(
			(data: Array<IDownloadOCDS>) => {
				this.downloads_ocsd = data.map(download => {
					let country_code = download.filename.replace('_ocds_data.json.tar.gz', '');
					if (country_code.toUpperCase() === this.current.id) {
						this.current.formats.ocds = {
							filename: download.filename,
							size: download.size
						};
					}
					return {
						name: this.i18n.getPortalName(country_code, this.i18n.expandCountry(country_code)),
						size: download.size,
						lastUpdate: download.lastUpdate,
						filename: download.filename
					};
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
		let sub = this.api.getDownloads().subscribe(
			(data: Array<IDownload>) => {
				this.downloads = data.filter(download => {
					return (download.count > 0);
				}).map(download => {
					let result: Download = {
						name: download.country,
						country: download.country,
						lastUpdate: download.lastUpdate,
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
					if (result.country.toUpperCase() === this.current.id && result.count > 0) {
						this.current.count = download.count;
						this.current.formats.json = result.formats.json;
						this.current.formats.ndjson = result.formats.ndjson;
						this.current.formats.csv = result.formats.csv;
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
