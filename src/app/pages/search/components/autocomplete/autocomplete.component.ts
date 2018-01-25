import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {TypeaheadMatch} from '../../../../thirdparty/typeahead/typeahead-match.class';
import {Observable} from 'rxjs';
import {NotifyService} from '../../../../services/notify.service';
import {I18NService} from '../../../../modules/i18n/services/i18n.service';

@Component({
	selector: 'autocomplete',
	templateUrl: 'autocomplete.component.html',
	styleUrls: ['autocomplete.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AutoCompleteComponent implements OnChanges {
	@Input() placeholder: string = ' ';
	@Input() field: string = ' ';
	@Input() entity: string = ' ';
	@Input() value: string = '';
	@Output() onSelect = new EventEmitter();

	public selected: string = '';
	public optionField: string = 'key';
	public optionsLimit: number = 7;
	public asyncSelected: string = '';
	public typeaheadLoading: boolean = false;
	public typeaheadNoResults: boolean = false;
	public focused: boolean = false;
	public items: Array<string> = [];
	public loading: number = 0;
	public dataSource: Observable<any>;

	public constructor(private api: ApiService, private notify: NotifyService, public i18n: I18NService) {
		this.init();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.value && changes.value.currentValue && changes.value.currentValue !== this.asyncSelected) {
			this.asyncSelected = changes.value.currentValue;
		}
	}

	init() {
		this.dataSource = Observable.create((observer: any) => {
			let query = (this.asyncSelected || '').trim();
			if (query.length === 0) {
				return observer.next([]);
			}
			this.loading++;
			let sub = this.api.autocomplete(this.entity, this.field, query).subscribe(
				(result: any) => {
					observer.next(result.data);
				},
				(error) => {
					this.notify.error(error);
					observer.next([]);
				},
				() => {
					this.loading--;
					sub.unsubscribe();
				}
			);
		});

	}

	public isEmpty(): boolean {
		return !this.focused && ((!this.asyncSelected) || (this.asyncSelected.length === 0));
	}

	public changeTypeaheadLoading(e: boolean) {
		this.typeaheadLoading = e;
	}

	public changeTypeaheadNoResults(e: boolean) {
		this.typeaheadNoResults = e;
	}

	public typeaheadOnFocus(e: boolean) {
		this.focused = e;
	}

	public typeaheadOnBlur(e: boolean) {
	}

	public typeaheadOnSelect(e: TypeaheadMatch) {
		this.onSelect.emit({value: e.item ? e.item.key : e.value});
	}
}
