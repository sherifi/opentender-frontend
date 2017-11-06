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

	public minScore: number = 0;
	public maxScore: number = 10;
	public startScore: number = 0;
	public endScore: number = 10;

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
