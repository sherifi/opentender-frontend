import {Component, OnInit, OnDestroy} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {ISector, ISectorsApiResult} from '../../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'sector',
	templateUrl: 'sector.template.html'
})
export class SearchSectorPage implements OnInit, OnDestroy {
	private subscription: any;
	public error: string;
	public sectors: Array<ISector> = [];

	constructor(private api: ApiService) {
	}

	ngOnInit(): void {
		this.subscription = this.api.getSectors().subscribe(
			result => this.display(result),
			error => {
				this.error = error._body;
				// console.error(error);
			},
			() => {
				// console.log('sector complete');
			});
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	display(result: ISectorsApiResult): void {
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
