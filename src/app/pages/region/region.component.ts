import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {SearchCommand} from '../../model/search';
import {TitleService} from '../../services/title.service';
import {StateService} from '../../services/state.service';
import {IStats, IRegion, IRegionStats} from '../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'region',
	templateUrl: 'region.template.html'
})
export class RegionPage implements OnInit, OnDestroy {
	public region: IRegion;
	public parent_regions: Array<IRegion> = [];
	public error: string;
	public search_cmd: SearchCommand;
	public columnIds = ['id', 'title', 'titleEnglish', 'buyers.name', 'lots.bids.bidders'];
	private subscription: any;

	constructor(private route: ActivatedRoute, private api: ApiService, private titleService: TitleService, private state: StateService) {
	}

	ngOnInit(): void {
		let state = this.state.get('region');
		if (state) {
			this.columnIds = state.columnIds;
		}
		this.subscription = this.route.params.subscribe(params => {
			let id = params['id'];
			this.api.getRegionStats({id: id}).subscribe(
				(result) => this.display(result.data),
				(error) => {
					this.error = error._body;
					// console.error(error);
				},
				() => {
					// console.log('region complete');
				});
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.state.put('region', {
			columnIds: this.columnIds
		});
	}

	display(data: IRegionStats): void {
		this.region = null;
		this.parent_regions = [];
		if (!data) {
			return;
		}
		this.region = data.region;
		this.parent_regions = data.parents || [];
		this.displayStats(data.stats);
		this.search();
	}

	displayStats(data: IStats): void {
	}

	search() {
		if (!this.region) {
			return;
		}
		let field = (this.region.id.length >= 2) ? '.nuts' + (this.region.id.length - 2) : '';
		let search_cmd = new SearchCommand();
		search_cmd.filters = [
			{
				field: 'buyers.address.nuts' + field,
				type: 'term',
				value: [this.region.id]
			},
			{
				field: 'lots.bids.bidders.address.nuts' + field,
				type: 'term',
				value: [this.region.id]
			}];
		this.search_cmd = search_cmd;
	}

	searchChange(data) {
	}

}
