import {Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import {formatLabel} from '../../utils/label.helper';
import {getTooltipLabeledText} from '../tooltip/tooltip.helper';
import {IColorScaleType} from '../../chart.interface';
import {ColorHelper} from '../../utils/color.helper';

// import {animate, style, transition, trigger} from '@angular/animations';

@Component({
	selector: 'g[ngx-charts-series-vertical]',
	template: `
		<svg:g ngx-charts-bar *ngFor="let bar of bars; trackBy:trackBy"
			   [width]="bar.width"
			   [height]="bar.height"
			   [x]="bar.x"
			   [y]="bar.y"
			   [fill]="bar.color"
			   [stops]="bar.gradientStops"
			   [data]="bar.data"
			   [replacement]="bar.replacement"
			   [orientation]="'vertical'"
			   [roundEdges]="bar.roundEdges"
			   [gradient]="gradient"
			   [isActive]="isActive(bar.data)"
			   (select)="onClick($event)"
			   (activate)="activate.emit($event)"
			   (deactivate)="deactivate.emit($event)"
			   ngx-tooltip
			   [tooltipPlacement]="'top'"
			   [tooltipType]="'tooltip'"
			   [tooltipTitle]="bar.tooltipText">
		</svg:g>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// animations: [
	// 	trigger('animationState', [
	// 		transition('* => void', [
	// 			style({
	// 				opacity: 1,
	// 				transform: '*',
	// 			}),
	// 			animate(500, style({opacity: 0, transform: 'scale(0)'}))
	// 		])
	// 	])
	// ]
})
export class BarSeriesVerticalComponent implements OnChanges {
	@Input() dims;
	@Input() type = 'standard';
	@Input() series;
	@Input() xScale;
	@Input() yScale;
	@Input() colors: ColorHelper;
	@Input() gradient: boolean = false;
	@Input() activeEntries: any[];
	@Input() valueFormatting: (value) => string;

	@Output() select = new EventEmitter();
	@Output() activate = new EventEmitter();
	@Output() deactivate = new EventEmitter();

	bars: any;
	x: any;
	y: any;

	ngOnChanges(changes): void {
		this.update();
	}

	update(): void {
		if (!this.series) {
			return;
		}
		let width;
		if (this.series.length) {
			width = this.xScale.bandwidth();
		}

		let d0 = 0;
		let total;
		if (this.type === 'normalized') {
			total = this.series.map(d => d.value).reduce((sum, d) => {
				return sum + d;
			}, 0);
		}

		this.bars = this.series.map((d) => {
			let value = d.value;
			let label = d.name;
			const formattedLabel = formatLabel(label);
			const roundEdges = false; // this.type === 'standard';

			let bar: any = {
				value,
				label,
				roundEdges: roundEdges,
				data: d,
				width,
				formattedLabel,
				height: 0,
				x: 0,
				y: 0,
				replacement: d.replacement,
				id: d.id
			};

			if (this.type === 'standard') {
				bar.height = Math.abs(this.yScale(value) - this.yScale(0));
				bar.x = this.xScale(label);

				if (value < 0) {
					bar.y = this.yScale(0);
				} else {
					bar.y = this.yScale(value);
				}
			} else if (this.type === 'stacked') {
				let offset0 = d0;
				let offset1 = offset0 + value;
				d0 += value;

				bar.height = this.yScale(offset0) - this.yScale(offset1);
				bar.x = 0;
				bar.y = this.yScale(offset1);
				bar.offset0 = offset0;
				bar.offset1 = offset1;
			} else if (this.type === 'normalized') {
				let offset0 = d0;
				let offset1 = offset0 + value;
				d0 += value;

				if (total > 0) {
					offset0 = (offset0 * 100) / total;
					offset1 = (offset1 * 100) / total;
				} else {
					offset0 = 0;
					offset1 = 0;
				}

				bar.height = this.yScale(offset0) - this.yScale(offset1);
				bar.x = 0;
				bar.y = this.yScale(offset1);
				bar.offset0 = offset0;
				bar.offset1 = offset1;
				value = (offset1 - offset0).toFixed(2) + '%';
			}

			if (this.colors.scaleType === IColorScaleType.Ordinal) {
				bar.color = d.color || this.colors.getColor(label);
			} else if (this.colors.scaleType === IColorScaleType.Linear) {
				bar.color = d.color || this.colors.getColor(value);
			} else {
				if (this.type === 'standard') {
					bar.color = d.color || this.colors.getColor(value);
					if (this.gradient) {
						bar.gradientStops = this.colors.getLinearGradientStops(value);
					}
				} else {
					bar.color = d.color || this.colors.getColor(bar.offset1);
					if (this.gradient) {
						bar.gradientStops = this.colors.getLinearGradientStops(bar.offset1, bar.offset0);
					}
				}
			}

			if (d.replacement) {
				bar.tooltipText = d.replacement;
			} else {
				bar.tooltipText = getTooltipLabeledText(formattedLabel, this.valueFormatting ? this.valueFormatting(value) : value.toLocaleString());
			}
			return bar;
		});
	}

	isActive(entry): boolean {
		if (!this.activeEntries) {
			return false;
		}
		let item = this.activeEntries.find(d => {
			return entry.name === d.name && entry.series === d.series;
		});
		return item !== undefined;
	}

	onClick(data): void {
		this.select.emit(data);
	}

	trackBy(index, bar): string {
		return bar.id || bar.label;
	}

}
