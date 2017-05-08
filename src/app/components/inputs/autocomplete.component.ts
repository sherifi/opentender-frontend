import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {TypeaheadMatch} from '../../thirdparty/typeahead/typeahead-match.class';
import {Observable} from 'rxjs';

@Component({
	selector: 'autocomplete',
	templateUrl: 'autocomplete.component.html',
})
export class AutoCompleteComponent {
	@Input() placeholder: string = ' ';
	@Input() field: string = ' ';
	@Input() entity: string = ' ';
	@Output() onSelect = new EventEmitter();

	public selected: string = '';
	public optionField: string = 'key';
	public optionsLimit: number = 7;
	public asyncSelected: string = '';
	public typeaheadLoading: boolean = false;
	public typeaheadNoResults: boolean = false;
	public focused: boolean = false;
	public items: Array<string> = [];
	public dataSource = Observable.create((observer: any) => {
		this.api.autocomplete(this.entity, this.field, this.asyncSelected).subscribe(
			(result: any) => {
				observer.next(result.data);
			},
			(error) => {
				console.log(error);
				observer.next([]);
			}
		);
	});

	public constructor(private api: ApiService) {
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

	public typeaheadOnBlur() {
	}

	public typeaheadOnSelect(e: TypeaheadMatch) {
		this.onSelect.emit({value: e.item ? e.item.key : e.value});
	}
}