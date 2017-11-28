import {Component, Input, EventEmitter, Output, OnChanges, SimpleChanges} from '@angular/core';

@Component({
	moduleId: __filename,
	selector: 'select-year-range',
	templateUrl: 'select-year-range.component.html'
})
export class SelectYearRangeComponent implements OnChanges {
	@Input()
	years: Array<number>;

	@Input()
	defStartYear: number;

	@Input()
	defEndYear: number;

	@Output('onRangeChange')
	onRangeChange = new EventEmitter();

	public minYear: number = 0;
	public maxYear: number = 0;
	public startYear: number = 0;
	public endYear: number = 0;
	public isSet: boolean = false;
	public empty: boolean = false;

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.years && changes.years.currentValue !== null) {
			this.setYears();
		}
	}

	setYears() {
		if (this.isSet) {
			return;
		}
		let years = this.years || [];
		let startYear = 0;
		let endYear = 0;
		years.forEach((year) => {
			startYear = startYear == 0 ? year : Math.min(year, startYear);
			endYear = endYear == 0 ? year : Math.max(year, endYear);
		});
		this.minYear = startYear;
		this.maxYear = endYear;
		this.startYear = startYear;
		this.endYear = endYear;
		this.empty = years.length === 0;
		this.isSet = true;
	}

	onSliderChange(event) {
		if (!this.isSet) {
			return;
		}
		this.startYear = event.startValue;
		this.endYear = event.endValue;
		if (this.startYear > 0 && this.endYear > 0 &&
			((this.startYear !== this.minYear) || (this.endYear !== this.maxYear))
		) {
			this.onRangeChange.emit({data: {startValue: this.startYear, endValue: this.endYear}});
		} else {
			this.onRangeChange.emit({data: null});
		}
	}

}
