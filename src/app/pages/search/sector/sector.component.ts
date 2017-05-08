import {Component, OnInit, OnDestroy} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {ISector} from '../../../app.interfaces';

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
			result => this.display(result.data),
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

	display(data: Array<ISector>): void {
		if (data) {
			this.sectors = data;
		}
	}

}
