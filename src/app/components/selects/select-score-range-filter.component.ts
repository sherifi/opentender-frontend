import {Component, Input, EventEmitter, Output, OnChanges, SimpleChanges} from '@angular/core';
import {ISearchFilter, ISearchResultBucket} from '../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'select-score-range-filter',
	templateUrl: 'select-score-range-filter.component.html'
})
export class SelectScoreRangeFilterComponent implements OnChanges {
	@Input()
	filter: ISearchFilter;

	@Input()
	buckets: Array<ISearchResultBucket>;

	@Output('onRangeChange') onRangeChange = new EventEmitter();

	private minScore: number = 0;
	private maxScore: number = 10;
	private startScore: number = 0;
	private endScore: number = 10;

	formatScoreTick(value) {
		return value / 10;
	}

	restoreFilter(filter: ISearchFilter) {
		if (filter.values) {
			this.startScore = filter.values[0] * 10;
			this.endScore = filter.values[1] * 10;
		}
	}

	applyBuckets(buckets) {
		// if (this.filter && !this.filter.minmax) {
		// 	if (buckets.length == 1) {
		// 		this.filter.minmax = [buckets[0].key, buckets[0].key];
		// 	} else {
		// 		this.filter.minmax = [2100, 2000];
		// 		buckets.forEach(bucket => {
		// 			this.filter.minmax[0] = Math.min(this.filter.minmax[0], bucket.key);
		// 			this.filter.minmax[1] = Math.max(this.filter.minmax[1], bucket.key);
		// 		});
		// 	}
		// 	this.minScore = this.filter.minmax[0];
		// 	this.maxScore = this.filter.minmax[1];
		// 	if (this.startScore < this.minScore) {
		// 		this.startScore = this.minScore;
		// 	}
		// 	if (this.endScore > this.maxScore) {
		// 		this.endScore = this.maxScore;
		// 	}
		// }
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.filter && changes.filter.currentValue) {
			this.restoreFilter(changes.filter.currentValue);
		}
		if (changes.buckets && changes.buckets.currentValue) {
			this.applyBuckets(changes.buckets.currentValue);
		}
	}

	onSliderChange(event) {
		this.startScore = event.startValue;
		this.endScore = event.endValue;
		this.filter.values = [this.startScore / 10, this.endScore / 10];
		this.onRangeChange.emit();
	}

}
