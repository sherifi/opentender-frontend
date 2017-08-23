import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {ISector, IStats} from '../../../app.interfaces';
import {SearchCommandFilter} from '../../../model/search';
import {NotifyService} from '../../../services/notify.service';

@Component({
	moduleId: __filename,
	selector: 'market-analysis',
	templateUrl: 'market-analysis.template.html'
})
export class DashboardsMarketAnalysisPage implements OnInit, OnDestroy {
	private sectors_stats: Array<{ sector: ISector, stats: IStats }> = [];
	private loading: number = 0;
	private viz: {
		sectors_stats: Array<{ sector: ISector; stats: IStats }>;
	} = {
		sectors_stats: null
	};
	private filter: {
		time?: {
			startYear: number;
			endYear: number;
			selectedStartYear: number;
			selectedEndYear: number;
		}
	} = {
		time: null
	};

	constructor(private api: ApiService, private notify: NotifyService) {
	}


	onSliderChange(event) {
		if (!this.filter.time) {
			return;
		}
		this.filter.time.selectedStartYear = event.startValue;
		this.filter.time.selectedEndYear = event.endValue;
		this.visualize();
	}

	visualize() {
		let filters = this.buildFilters();
		this.loading++;
		this.api.getMarketAnalysisStats({filters: filters}).subscribe(
			(result) => {
				this.display(result.data);
			},
			(error) => {
				this.notify.error(error);
			},
			() => {
				this.loading--;
			});
	}

	public ngOnInit(): void {
		this.visualize();
		// this.search();
	}

	public ngOnDestroy(): void {
	}

	buildFilters() {
		let filters = [];
		if (this.filter.time && this.filter.time.selectedStartYear > 0 && this.filter.time.selectedEndYear > 0) {
			let yearFilter: SearchCommandFilter = {
				field: 'lots.awardDecisionDate',
				type: 'range',
				value: [this.filter.time.selectedStartYear, this.filter.time.selectedEndYear + 1],
			};
			filters.push(yearFilter);
		}
		return filters;
	}

	display(data: IStats): void {
		this.sectors_stats = [];
		this.viz.sectors_stats = null;
		if (data) {
			this.viz.sectors_stats = data.sectors_stats;
			this.sectors_stats = data.sectors_stats;
		}
		if (!this.filter.time && data.histogram_lots_awardDecisionDate) {
			let startYear = 0;
			let endYear = 0;
			Object.keys(data.histogram_lots_awardDecisionDate).forEach((key) => {
				let year = parseInt(key, 10);
				startYear = startYear == 0 ? year : Math.min(year, startYear);
				endYear = endYear == 0 ? year : Math.max(year, endYear);
			});
			this.filter.time = {
				startYear, endYear,
				selectedStartYear: startYear,
				selectedEndYear: endYear
			};
		}
	}

}
