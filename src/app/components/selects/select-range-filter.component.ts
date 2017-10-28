import {Component, Input, EventEmitter, Output, OnChanges, SimpleChanges} from '@angular/core';
import {ISearchFilter, ISearchResultBucket} from '../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'select-range-filter',
	templateUrl: 'select-range-filter.component.html'
})
export class SelectRangeFilterComponent implements OnChanges {
	@Input()
	filter: ISearchFilter;

	@Input()
	buckets: Array<ISearchResultBucket>;

	@Output('onRangeChange') onRangeChange = new EventEmitter();

	private minYear: number = 2009;
	private maxYear: number = 2017;
	private startYear: number = 2009;
	private endYear: number = 2017;

	restoreFilter(filter: ISearchFilter) {
		if (filter.values) {
			this.startYear = filter.values[0];
			this.endYear = filter.values[1] - 1;
		}
		if (filter.minmax) {
			this.minYear = filter.minmax[0];
			this.maxYear = filter.minmax[1];
		}
	}

	applyBuckets(buckets) {
		if (this.filter && !this.filter.minmax) {
			if (buckets.length == 1) {
				this.filter.minmax = [buckets[0].key, buckets[0].key];
			} else {
				this.filter.minmax = [2100, 2000];
				buckets.forEach(bucket => {
					this.filter.minmax[0] = Math.min(this.filter.minmax[0], bucket.key);
					this.filter.minmax[1] = Math.max(this.filter.minmax[1], bucket.key);
				});
			}
			this.minYear = this.filter.minmax[0];
			this.maxYear = this.filter.minmax[1];
			if (this.startYear < this.minYear) {
				this.startYear = this.minYear;
			}
			if (this.endYear > this.maxYear) {
				this.endYear = this.maxYear;
			}
		}
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
		this.startYear = event.startValue;
		this.endYear = event.endValue;
		this.filter.values = [this.startYear, this.endYear + 1];
		this.onRangeChange.emit();
	}

}
