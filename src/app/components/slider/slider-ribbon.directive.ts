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

	triggerChange(clientX) {
		// Cross-browser mouse positioning http://www.jacklmoore.com/notes/mouse-position/
		let target = this.el.nativeElement.parentNode;
		let style = target.currentStyle || window.getComputedStyle(target, null);
		let borderLeftWidth = parseInt(style['borderLeftWidth'], 10);
		let rect = target.getBoundingClientRect();
		let offsetX = clientX - borderLeftWidth - rect.left;
		if (!isNaN(offsetX)) {
			this.onChanged.emit({value: offsetX});
		}
	}

	@HostListener('mousedown', ['$event'])
	clickRibbon(event) {
		this.triggerChange(event.clientX);
	}

}
