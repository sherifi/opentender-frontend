import {Component, Input, EventEmitter, Output} from '@angular/core';
import {Filter} from '../../model/search';

@Component({
	moduleId: __filename,
	selector: 'select-range-filter',
	templateUrl: 'select-range-filter.component.html'
})
export class SelectRangeFilterComponent {
	@Input()
	filter: Filter;

	@Input()
	buckets: Array<any>;

	@Output('onRangeChange') onRangeChange = new EventEmitter();

	// TODO: get the range from api
	private minYear: number = 2009;
	private startYear: number = 2009;
	private maxYear: number = 2017;
	private endYear: number = 2017;

	onSliderChange(event) {
		this.startYear = event.startValue;
		this.endYear = event.endValue;
		this.filter.values = [this.startYear, this.endYear + 1];
		this.onRangeChange.emit();
	}

}
