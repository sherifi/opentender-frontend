import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {ISector, IStats} from '../../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'market-analysis',
	templateUrl: 'market-analysis.template.html'
})
export class DashboardsMarketAnalysisPage implements OnInit, OnDestroy {
	private error: string;
	private sectors_stats: Array<{ sector: ISector, stats: IStats }> = [];
	private viz: {
		sectors_stats: Array<{ sector: ISector; stats: IStats }>;
	} = {
		sectors_stats: null
	};

	constructor(private api: ApiService) {
	}

	public ngOnInit(): void {
		this.api.getMarketAnalysisStats({}).subscribe(
			(result) => {
				this.display(result.data);
			},
			(error) => {
				this.error = error._body;
				// console.error(error);
			},
			() => {
				// console.log('sector complete');
			});
	}

	public ngOnDestroy(): void {
	}

	display(data: IStats): void {
		this.sectorInfos=[];
		this.viz.sectors_stats = null;
		if (data) {
			this.viz.sectors_stats = data.sectors_stats;
			this.sectors_stats = data.sectors_stats;
		}
	}

}
