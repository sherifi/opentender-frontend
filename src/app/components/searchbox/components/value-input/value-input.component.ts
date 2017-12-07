import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
	selector: 'valueinput',
	templateUrl: 'value-input.component.html',
	styleUrls: ['value-input.component.scss'],
})
export class ValueInputComponent {
	@Input() placeholder: string = ' ';
	@Output() onSelect = new EventEmitter();

	public focused: boolean = false;
	public invalidNumber: boolean = false;

	public mode = '>';
	public value = '';

	public constructor() {
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
		let modes = ['<', '>', '='];
		let i = (modes.indexOf(this.mode) + 1) % modes.length;
		this.mode = modes[i];
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
