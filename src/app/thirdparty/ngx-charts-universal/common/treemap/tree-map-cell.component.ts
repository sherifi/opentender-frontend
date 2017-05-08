import {Component, Input, Output, EventEmitter, ElementRef, OnChanges, SimpleChanges, ChangeDetectionStrategy} from '@angular/core';
import d3 from '../../d3';
import {invertColor} from '../../utils/color.helper';
import {PlatformService} from '../../../../services/platform.service';

@Component({
	selector: 'g[ngx-charts-tree-map-cell]',
	template: `
    <svg:g>
      <svg:rect
        [attr.fill]="fill"
        [attr.width]="width"
        [attr.height]="height"
        [style.cursor]="'pointer'"
        [attr.x]="x"
        [attr.y]="y"
        [attr.width]="width"
        [attr.height]="height"
      class="cell"
        (click)="onClick()"
      />
      <svg:foreignObject
        *ngIf="width >= 70 && height >= 70"
        [attr.x]="x"
        [attr.y]="y"
        [attr.width]="width"
        [attr.height]="height"
        class="label"
        [style.pointer-events]="'none'">
        <xhtml:p
          [style.color]="textColor"
          [style.height]="height + 'px'"
          [style.width]="width + 'px'">
          <xhtml:span class="treemap-label">{{formatLabel(label)}}</xhtml:span>
          <xhtml:span class="treemap-val" [style.fontSize]="fontSize" ngx-charts-count-up [countTo]="value" [formatCountUpNumber]="formatCellNumber">
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

	constructor(private elementRef: ElementRef, private platform: PlatformService) {
		this.element = elementRef.nativeElement;
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
		this.numberFontSize();
		this.textColor = this.getTextColor();
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
		return s.split('(')[0].split(':')[0]
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

		let node = d3.select(this.element).select('.cell');

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
		let node = d3.select(this.element).select('.cell');

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
