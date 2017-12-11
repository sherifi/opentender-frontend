import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {ISector, IApiResultSectors} from '../../../app.interfaces';
import {NotifyService} from '../../../services/notify.service';

@Component({
	moduleId: __filename,
	selector: 'sector',
	templateUrl: 'sector.component.html'
})
export class SearchSectorPage implements OnInit {
	private loading: number = 0;
	public sectors: Array<ISector> = [];

	constructor(private api: ApiService, private notify: NotifyService) {
	}

	ngOnInit(): void {
		this.loading++;
		let sub = this.api.getSectors().subscribe(
			result => {
				this.display(result);
			},
			error => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
				sub.unsubscribe();
			});
	}

	display(result: IApiResultSectors): void {
		this.sectors = [];
		if (result && result.data) {
			this.sectors = Object.keys(result.data).map(key => {
				return {
					id: key,
					level: result.data[key].level,
					name: result.data[key].name,
					value: result.data[key].value
				};
			});
		}
	}

}
