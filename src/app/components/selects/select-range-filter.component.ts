import {Component, Input, EventEmitter, Output, OnChanges, SimpleChanges} from '@angular/core';
import {Filter} from '../../model/search';
import {yearOf} from '../../thirdparty/ngx-charts-universal/utils/date.helper';

@Component({
	moduleId: __filename,
	selector: 'select-range-filter',
	templateUrl: 'select-range-filter.component.html'
})
export class SelectRangeFilterComponent implements OnChanges {
	@Input()
	filter: Filter;

	@Input()
	buckets: Array<any>;

	@Output('onRangeChange') onRangeChange = new EventEmitter();

	private minYear: number = 0;
	private startYear: number = 0;
	private maxYear: number = 0;
	private endYear: number = 0;

	public ngOnChanges(changes: SimpleChanges): void {
		if (this.minYear === 0 && this.buckets) {
			this.buckets.forEach(bucket => {
				let year = yearOf(bucket.key);
				this.minYear = this.minYear === 0 ? year : Math.min(year, this.minYear);
				this.maxYear = this.maxYear === 0 ? year : Math.max(year, this.maxYear);
				this.startYear = this.minYear;
				this.endYear = this.maxYear;
			});
		}
	}

	onSliderChange(event) {
		this.startYear = event.startValue;
		this.endYear = event.endValue;
		this.filter.values = [this.startYear, this.endYear + 1];
		this.onRangeChange.emit();
	}

}
