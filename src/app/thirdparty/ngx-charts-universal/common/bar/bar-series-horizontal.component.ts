import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy} from '@angular/core';
// import {animate, style, transition, trigger} from '@angular/animations';
import {formatLabel} from '../../utils/label.helper';
import {getTooltipLabeledText} from '../tooltip/tooltip.helper';
import {IColorScaleType} from '../../chart.interface';
import {ColorHelper} from '../../utils/color.helper';

@Component({
	selector: 'g[ngx-charts-series-horizontal]',
	template: `
		<svg:g ngx-charts-bar
			   *ngFor="let bar of bars; trackBy: trackBy"
			   [width]="bar.width"
			   [height]="bar.height"
			   [x]="bar.x"
			   [y]="bar.y"
			   [fill]="bar.color"
			   [stops]="bar.gradientStops"
			   [data]="bar.data"
			   [orientation]="'horizontal'"
			   [roundEdges]="bar.roundEdges"
			   (select)="click($event)"
			   [gradient]="gradient"
			   [isActive]="isActive(bar.data)"
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
export class BarSeriesHorizontalComponent implements OnChanges {
	bars: any;
	x: any;
	y: any;

	@Input() dims;
	@Input() type = 'standard';
	@Input() series;
	@Input() xScale;
	@Input() yScale;
	@Input() colors: ColorHelper;
	@Input() gradient: boolean;
	@Input() activeEntries: any[];
	@Input() valueFormatting: (value) => string;

	@Output() select = new EventEmitter();
	@Output() activate = new EventEmitter();
	@Output() deactivate = new EventEmitter();

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
	}

	update(): void {
		if (!this.series) {
			return;
		}
		let d0 = 0;
		let total;
		if (this.type === 'normalized') {
			total = this.series.map(d => d.value).reduce((sum, d) => {
				return sum + d;
			}, 0);
		}

		this.bars = this.series.map((d, index) => {
			let value = d.value;
			let label = d.name;
			const formattedLabel = formatLabel(label);
			const roundEdges = false; // this.type === 'standard';

			let bar: any = {
				id: d.id,
				value,
				label,
				roundEdges,
				data: d,
				formattedLabel
			};

			bar.height = this.yScale.bandwidth();

			if (this.type === 'standard') {
				bar.width = Math.abs(this.xScale(value) - this.xScale(0));
				if (value < 0) {
					bar.x = this.xScale(value);
				} else {
					bar.x = this.xScale(0);
				}
				bar.y = this.yScale(label);
			} else if (this.type === 'stacked') {
				let offset0 = d0;
				let offset1 = offset0 + value;
				d0 += value;

				bar.width = this.xScale(offset1) - this.xScale(offset0);
				bar.x = this.xScale(offset0);
				bar.y = 0;
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

				bar.width = this.xScale(offset1) - this.xScale(offset0);
				bar.x = this.xScale(offset0);
				bar.y = 0;
				bar.offset0 = offset0;
				bar.offset1 = offset1;
				value = (offset1 - offset0).toFixed(2) + '%';
			}

			if (this.colors.scaleType === IColorScaleType.Ordinal) {
				bar.color = this.colors.getColor(label);
			} else {
				if (this.type === 'standard') {
					bar.color = this.colors.getColor(value);
					bar.gradientStops = this.colors.getLinearGradientStops(value);
				} else {
					bar.color = this.colors.getColor(bar.offset1);
					bar.gradientStops = this.colors.getLinearGradientStops(bar.offset1, bar.offset0);
				}
			}

			bar.tooltipText = getTooltipLabeledText(formattedLabel, this.valueFormatting ? this.valueFormatting(value) : value.toLocaleString());
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

	trackBy(index, bar) {
		return bar.id || bar.label;
	}

	click(data): void {
		this.select.emit(data);
	}
}
