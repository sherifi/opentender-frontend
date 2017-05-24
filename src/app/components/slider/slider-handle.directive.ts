import {Directive, Input, Output, ElementRef, EventEmitter, OnChanges, SimpleChanges, Renderer2} from '@angular/core';

export interface IEventSlideAble {
	value: number;
}

@Directive({
	selector: '[sliderhandle]',
	host: {
		'(mousedown)': 'slideStart($event)',
		'(touchstart)': 'slideStart($event)'
	}
})
export class SliderHandleDirective implements OnChanges {

	@Input() left: number;
	@Input() min = 0;
	@Input() max = 0;
	@Output() onChanged = new EventEmitter<IEventSlideAble>();

	pos: number;

	constructor(private el: ElementRef, private renderer: Renderer2) {
	}

	setPos(value: number) {
		this.pos = value;
		this.renderer.setStyle(this.el.nativeElement, 'left', value + 'px');
	}

	setDragging(active: boolean) {
		if (active) {
			this.renderer.addClass(this.el.nativeElement, 'sliding');
		} else {
			this.renderer.removeClass(this.el.nativeElement, 'sliding');
		}
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.setPos(this.left);
	}

	slideStart(e) {
		this.setDragging(true);
		// Cross-browser mouse positioning http://www.jacklmoore.com/notes/mouse-position/
		let target = this.el.nativeElement.parentNode,
			style = target.currentStyle || window.getComputedStyle(target, null),
			borderLeftWidth = parseInt(style['borderLeftWidth'], 10),
			borderTopWidth = parseInt(style['borderTopWidth'], 10),
			rect = target.getBoundingClientRect();

		// deny dragging and selecting
		document.ondragstart = function() {
			return false;
		};
		document.body.onselectstart = function() {
			return false;
		};

		function dragProcess(event) {
			let offsetX = event.clientX - borderLeftWidth - rect.left;
			offsetX = Math.max(offsetX, this.min);
			offsetX = Math.min(offsetX, this.max);
			this.setPos(offsetX);
		}

		function dragProcessTouch(event) {
			const touches = event.changedTouches;
			for (let i = 0; i < touches.length; i++) {
				if (touches[i].target == this.el.nativeElement) {
					dragProcess(touches[i]);
				}
			}
		}

		function slideStop(event) {
			document.onmousemove = null;
			document.ontouchmove = null;
			document.onmouseup = null;
			document.ontouchend = null;
			this.setDragging(false);
			this.onChanged.emit({value: this.pos});
		}

		document.onmousemove = dragProcess.bind(this);
		document.ontouchmove = dragProcessTouch.bind(this);

		document.onmouseup = slideStop.bind(this);
		document.ontouchend = slideStop.bind(this);
	}

}
