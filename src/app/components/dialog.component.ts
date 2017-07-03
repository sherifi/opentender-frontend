import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
// import {animate, style, transition, trigger} from '@angular/animations';

@Component({
	selector: 'app-dialog',
	templateUrl: 'dialog.component.html',
	// animations: [
		// trigger('dialog', [
		// 	transition('void => *', [
		// 		style({transform: 'scale3d(.3, .3, .3)'}),
		// 		animate(100)
		// 	]),
		// 	transition('* => void', [
		// 		animate(100, style({transform: 'scale3d(.0, .0, .0)'}))
		// 	])
		// ])
	// ]
})
export class DialogComponent implements OnInit {
	@Input() closable = true;
	@Input() title: string;
	@Input() visible: boolean;
	@Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor() {
	}

	ngOnInit() {
	}

	close() {
		this.visible = false;
		this.visibleChange.emit(this.visible);
	}
}
