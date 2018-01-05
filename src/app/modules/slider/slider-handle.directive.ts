import {Directive, Input, Output, ElementRef, EventEmitter, OnChanges, SimpleChanges, Renderer2, HostListener} from '@angular/core';

export interface IEventSlideAble {
	value: number;
}
export interface IEventKeyDownAble {
	step: number;
}

@Directive({
	selector: '[sliderhandle]'
})
export class SliderHandleDirective implements OnChanges {

	@Input() left: number;
	@Input() min = 0;
	@Input() max = 0;
	@Output() onChanged = new EventEmitter<IEventSlideAble>();
	@Output() onKeyCommand = new EventEmitter<IEventKeyDownAble>();

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

	@HostListener('keypress', ['$event'])
	public keyRibbon(event) {
		if (event.keyCode === 39) {
			event.preventDefault();
			this.onKeyCommand.emit({step: 1});
		} else if (event.keyCode === 37) {
			event.preventDefault();
			this.onKeyCommand.emit({step: -1});
		}
	}

	@HostListener('mousedown', ['$event'])
	@HostListener('touchstart', ['$event'])
	slideStart(e) {
		this.setDragging(true);
		// Cross-browser mouse positioning http://www.jacklmoore.com/notes/mouse-position/
		let target = this.el.nativeElement.parentNode;
		let style = target.currentStyle || window.getComputedStyle(target, null);
		let borderLeftWidth = parseInt(style['borderLeftWidth'], 10);
		let rect = target.getBoundingClientRect();

		// deny dragging and selecting
		document.ondragstart = function() {
			return false;
		};
		document.body.onselectstart = function() {
			return false;
		};

		// iphone safari doesn't bind this properly
		let caller = this;

		function dragProcess(event) {
			let offsetX = event.clientX - borderLeftWidth - rect.left;
			offsetX = Math.max(offsetX, caller.min);
			offsetX = Math.min(offsetX, caller.max);
			caller.setPos(offsetX);
		}

		function dragProcessTouch(event) {
			const touches = event.changedTouches;
			for (let i = 0; i < touches.length; i++) {
				if (touches[i].target == caller.el.nativeElement) {
					dragProcess(touches[i]);
				}
			}
		}

		function slideStop(event) {
			document.onmousemove = null;
			document.ontouchmove = null;
			document.onmouseup = null;
			document.ontouchend = null;
			setTimeout(() => {
				caller.setDragging(false);
				caller.onChanged.emit({value: caller.pos});
			}, 0);
		}

		document.onmousemove = dragProcess.bind(this);
		document.ontouchmove = dragProcessTouch.bind(this);

		document.onmouseup = slideStop.bind(this);
		document.ontouchend = slideStop.bind(this);
	}

}
