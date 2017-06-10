import {Directive, Input, Output, ElementRef, EventEmitter, OnChanges, SimpleChanges, Renderer2, HostListener} from '@angular/core';

export interface IEventClickAble {
	value: number;
}

@Directive({
	selector: '[sliderribbon]'
})
export class SliderRibbonDirective {

	@Output() onChanged = new EventEmitter<IEventClickAble>();

	constructor(private el: ElementRef, private renderer: Renderer2) {
	}

	@HostListener('mousedown', ['$event'])
	@HostListener('touchstart', ['$event'])
	clickRibbon(event) {
		// Cross-browser mouse positioning http://www.jacklmoore.com/notes/mouse-position/
		let target = this.el.nativeElement.parentNode;
		let style = target.currentStyle || window.getComputedStyle(target, null);
		let borderLeftWidth = parseInt(style['borderLeftWidth'], 10);
		let rect = target.getBoundingClientRect();
		let offsetX = event.clientX - borderLeftWidth - rect.left;
		this.onChanged.emit({value: offsetX});
	}

}
