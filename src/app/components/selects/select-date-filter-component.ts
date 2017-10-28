import {Component, Input, EventEmitter, Output, OnChanges, SimpleChanges} from '@angular/core';
import {ISearchFilter, ISearchResultBucket} from '../../app.interfaces';
import {IMyDateModel, IMyDpOptions} from 'mydatepicker';
import {Utils} from '../../model/utils';

@Component({
	moduleId: __filename,
	selector: 'select-date-filter',
	templateUrl: 'select-date-filter-component.html'
})
export class SelectDateFilterComponent implements OnChanges {
	@Input()
	filter: ISearchFilter;
	public mode = '<';

	@Input()
	buckets: Array<ISearchResultBucket>;

	@Output('onChange') onChange = new EventEmitter();

	// TODO: date format & locales
	public myDatePickerOptions: IMyDpOptions = {
		dateFormat: 'dd.mm.yyyy'
	};

	public model: { date: { year: number, month: number, day: number } };

	constructor() {
	}

	public toggleMode(): void {
		let modes = ['<', '>', '='];
		let i = (modes.indexOf(this.mode) + 1) % modes.length;
		this.mode = modes[i];
		this.handleModeChange();
	}

	emitChange(): void {
		if (this.filter.values && this.filter.values.length > 0) {
			this.onChange.emit();
		}
	}

	handleModeChange(): void {
		this.filter.mode = this.mode;
		this.emitChange();
	}

	onDateChanged(event: IMyDateModel): void {
		this.filter.values = event.jsdate === null ? [] : [Utils.dateToUnix(event.jsdate)];
		this.onChange.emit();
	}

	restoreFilter(filter: ISearchFilter): void {
		if (filter.values) {
			this.mode = filter.mode || '<';
			if (filter.values && filter.values.length > 0) {
				let date = new Date(filter.values[0]);
				this.model = {date: {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()}};
			}
		}
	}

	applyBuckets(buckets: Array<ISearchResultBucket>) {
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.filter && changes.filter.currentValue) {
			this.restoreFilter(changes.filter.currentValue);
		}
		if (changes.buckets && changes.buckets.currentValue) {
			this.applyBuckets(changes.buckets.currentValue);
		}
	}

}
