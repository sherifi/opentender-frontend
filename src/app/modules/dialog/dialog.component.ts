import {Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
// import {animate, style, transition, state, trigger} from '@angular/animations';

@Component({
	selector: 'app-dialog',
	templateUrl: 'dialog.component.html',
	styleUrls: ['dialog.component.scss'],
	animations: [
		// trigger('slideDialog', [
		// 	state('enter', style({transform: 'none', opacity: 1})),
		// 	state('void', style({transform: 'translate3d(0, 25%, 0) scale(0.9)', opacity: 0})),
		// 	state('exit', style({transform: 'translate3d(0, 25%, 0)', opacity: 0})),
		// 	transition('* => *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
		// ])
		// trigger('slideDialog', [
		// 	transition('void => *', [
		// 		style({transform: 'scale3d(.3, .3, .3)'}),
		// 		animate(100)
		// 	]),
		// 	transition('* => void', [
		// 		animate(100, style({transform: 'scale3d(.0, .0, .0)'}))
		// 	])
		// ])
	],
	encapsulation: ViewEncapsulation.None
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
