/*
 TODO: respect stepValue with snap
 TODO: handle overflow tick labels
 */

import {Component, Input, Output, ElementRef, EventEmitter, OnChanges, SimpleChanges, HostListener} from '@angular/core';
import {PlatformService} from '../../services/platform.service';
import {IEventSlideAble} from './slider-handle.directive';

@Component({
	selector: 'slider',
	templateUrl: 'slider.component.html'
})

export class SliderComponent implements OnChanges {

	@Input() min: any = 0;
	@Input() max: any = 10;
	@Input() startValue: any = 0;
	@Input() endValue: any = 10;
	@Input() stepValue: any = 1;
	@Input() snap: any = true;

	@Input() set value(value: string) {
		this.startValue = parseFloat(value);
	}

	@Output('onSliderChange') onSliderChangeEvent = new EventEmitter();

	private ticks = [];
	private tickWidth = 1;
	private border = 18;

	private position = {
		range1: 50,
		range1min: 0,
		range1max: 300,
		range2: 300,
		range2min: 50,
		range2max: 600
	};

	constructor(private el: ElementRef, private platform: PlatformService) {
	}

	ngOnInit() {
		this.resize();
	}

	resize() {
		if (this.platform.isBrowser) {
			let r = this.el.nativeElement.getBoundingClientRect();
			this.position.range2max = r.right - r.left - (this.border * 2);
		}
		this.calculateTicks();
	}

	ngAfterViewInit() {
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.calculateTicks();
	}

	calculateTicks() {
		let min = parseFloat(this.min);
		let max = parseFloat(this.max);
		let step = parseFloat(this.stepValue);
		let valueSpan = max - min;
		this.tickWidth = Math.max(this.position.range2max / valueSpan, 1);
		this.ticks = [];
		for (let i = 0; i <= valueSpan; i = i + step) {
			this.ticks.push({value: min + i, width: this.tickWidth});
		}
		this.applyPositions();
	}

	applyPositions(): void {
		this.position.range1 = this.tickWidth * (this.startValue - this.min);
		this.position.range2min = this.position.range1;
		this.position.range2 = this.tickWidth * (this.endValue - this.min);
		this.position.range1max = this.position.range2;
	}

	valueFromPosition(x: number): number {
		let min = parseFloat(this.min);
		return (x / this.tickWidth) + min;
	}

	@HostListener('window:resize')
	onWindowResize(): void {
		this.resize();
	}

	changed() {
		this.onSliderChangeEvent.emit({startValue: this.startValue, endValue: this.endValue});
	}

	slider1Change(event: IEventSlideAble) {
		this.startValue = this.valueFromPosition(event.value);
		if (this.snap) {
			this.startValue = Math.round(this.startValue);
		}
		this.applyPositions();
		this.changed();
	}

	slider2Change(event: IEventSlideAble) {
		this.endValue = this.valueFromPosition(event.value);
		if (this.snap) {
			this.endValue = Math.round(this.endValue);
		}
		this.applyPositions();
		this.changed();
	}

}
