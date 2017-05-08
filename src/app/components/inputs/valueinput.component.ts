import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
	selector: 'valueinput',
	templateUrl: 'valueinput.component.html',
})
export class ValueInputComponent {
	@Input() placeholder: string = ' ';
	@Output() onSelect = new EventEmitter();

	public focused: boolean = false;
	public invalidNumber: boolean = false;

	public mode = '>';
	public value = '';

	public constructor(private api: ApiService) {
	}

	public onChange(event): void {
		let val = event.target.value.toString().trim();
		this.invalidNumber = (val.length > 0 && isNaN(parseFloat(val)));
		this.value = val;
	}

	public onKeyDown(e): void {
		if (e.keyCode === 13) {
			this.emit();
		}
	}

	public toggleMode(): void {
		if (this.mode === '>') {
			this.mode = '<';
		} else if (this.mode === '<') {
			this.mode = '=';
		} else if (this.mode === '=') {
			this.mode = '>';
		}
		if (this.value.length > 0) {
			this.emit();
		}
	}

	public onFocus(): void {
		this.focused = true;
	}

	public onBlur(): void {
		this.focused = false;
	}

	public isEmpty(): boolean {
		return !this.focused && (this.value.length === 0);
	}

	public emit() {
		if (!this.invalidNumber) {
			this.onSelect.emit({mode: this.mode, value: this.value});
		}
	}
}