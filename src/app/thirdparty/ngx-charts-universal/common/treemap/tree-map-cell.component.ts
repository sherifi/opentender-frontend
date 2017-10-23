import {Component, Input, Output, EventEmitter, ElementRef, OnChanges, SimpleChanges, ChangeDetectionStrategy, Directive} from '@angular/core';
import {invertColor} from '../../utils/color.helper';
import {PlatformService} from '../../../../services/platform.service';
import {select} from 'd3-selection';
import 'd3-transition';

@Directive({
	selector: '[measure]'
})

export class MeasureDirective implements OnChanges {
	@Input() measureTrigger: number;
	@Output() measured = new EventEmitter();

	constructor(private el: ElementRef, private platform: PlatformService) {

	}

	measure() {
		if (!this.platform.isBrowser) {
			return;
		}
		setTimeout(() => {
			let height = this.el.nativeElement.offsetHeight;
			let width = this.el.nativeElement.offsetWidth;
			this.measured.emit({width: width, height: height});
		}, 0);
	}

	ngAfterViewInit() {
		this.measure();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.measure();
	}
}


@Component({
	selector: 'g[ngx-charts-tree-map-cell]',
	template: `
    <svg:g>
      <svg:rect
        class="cell"
        [attr.fill]="fill"
        [attr.width]="width"
        [attr.height]="height"
        [style.cursor]="'pointer'"
        [attr.x]="x"
        [attr.y]="y"
        [attr.width]="width"
        [attr.height]="height"
        (click)="onClick()"
      />
      <svg:foreignObject
        *ngIf="canShowText()"
        [attr.x]="x"
        [attr.y]="y"
        [attr.width]="width"
        [attr.height]="height"
        class="label"
      	>
        <xhtml:p measure class="treemap-box" (click)="onClick()" [measureTrigger]="measureTrigger" (measured)="onMeasureTextBox($event)"
          [style.color]="textColor"
          [style.height.px]="height"
          [style.width.px]="width"
          [class.wordwrap]="wordwrap"
          >
		  <xhtml:span class="treemap-label">{{formatLabel(label)}}</xhtml:span>
          <xhtml:span class="treemap-val" [style.font-size]="fontSize" ngx-charts-count-up [countTo]="value" [formatCountUpNumber]="formatCellNumber">
          </xhtml:span>
        </xhtml:p>
      </svg:foreignObject>
    </svg:g>
  `,
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class TreeMapCellComponent implements OnChanges {

	@Input() fill: string;
	@Input() x: number;
	@Input() y: number;
	@Input() width: number;
	@Input() height: number;
	@Input() valueId: string;
	@Input() label: string;
	@Input() value: number;
	@Input() valueType;
	@Input() formatCellNumber: (n: number) => string;

	@Output() select = new EventEmitter();

	element: HTMLElement;
	fontSize = '';
	textColor = '';
	transform: string;
	initialized = false;
	measureTrigger = false;
	measuredHidden = false;
	wordwrap = true;

	constructor(private elementRef: ElementRef, private platform: PlatformService) {
		this.element = elementRef.nativeElement;
	}

	onMeasureTextBox(event) {
		this.measuredHidden = event.height - this.height > 2;
	}

	canShowText(): boolean {
		return !this.measuredHidden && this.width >= 70 && this.height >= 70;
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
		this.numberFontSize();
		this.textColor = this.getTextColor();
		this.measuredHidden = false;
		this.measureTrigger = !this.measureTrigger;
	}

	numberFontSize() {
		if (this.value === null) {
			return '20px';
		}
		let chars = this.formatCellNumber(this.value);
		if (chars.length === 0) {
			return '20px';
		}
		let w = (this.width / chars.length) * 1.5;
		w = Math.min(w, 20);
		this.fontSize = w.toFixed(0) + 'px';
	}

	formatLabel(s: string): string {
		return s.split('(')[0].split(':')[0];
	}

	update(): void {
		if (!this.platform.isBrowser) {
			return;
		}
		if (this.initialized) {
			this.animateToCurrentForm();
		} else {
			this.loadAnimation();
			this.initialized = true;
		}
	}

	loadAnimation(): void {

		let node = select(this.element).select('.cell');

		node
			.attr('opacity', 0)
			.attr('x', this.x)
			.attr('y', this.y)
			.attr('width', 0)
			.attr('height', 0)
		;

		this.animateToCurrentForm();
	}

	getTextColor(): string {
		return invertColor(this.fill);
	}

	animateToCurrentForm(): void {
		let node = select(this.element).select('.cell');

		node.transition().duration(750)
			.attr('opacity', 1)
			.attr('x', this.x)
			.attr('y', this.y)
			.attr('width', this.width)
			.attr('height', this.height);
	}

	onClick(): void {
		this.select.emit({
			name: this.label,
			value: this.value,
			id: this.valueId
		});
	}

}
