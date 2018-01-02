import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy} from '@angular/core';
// import {animate, style, transition, trigger} from '@angular/animations';
import {formatLabel} from '../../utils/label.helper';
import {getTooltipLabeledText} from '../tooltip/tooltip.helper';
import {IColorScaleType} from '../../chart.interface';
import {ColorHelper} from '../../utils/color.helper';

@Component({
	selector: 'g[ngx-charts-series-horizontal-labeled]',
	template: `

		<svg:g *ngFor="let bar of bars; trackBy: trackBy"
			   ngx-tooltip [tooltipPlacement]="'top'" [tooltipType]="'tooltip'" [tooltipTitle]="bar.tooltipText">
			<svg:g ngx-charts-axis-label
				   style="cursor: pointer;"
				   [style.font-size]="bar.fontSize"
				   [label]="bar.formattedLabel"
				   [offset]="bar.y"
				   [orient]="'inline'"
				   [height]="bar.height"
				   [width]="dims.width"
				   (click)="click(bar.data)"
			></svg:g>
			<svg:g ngx-charts-bar
				   [width]="bar.width"
				   [height]="bar.barHeight"
				   [x]="bar.x"
				   [y]="bar.barY"
				   [fill]="bar.color"
				   [stops]="bar.gradientStops"
				   [data]="bar.data"
				   [orientation]="'horizontal'"
				   [roundEdges]="bar.roundEdges"
				   (select)="click($event)"
				   [gradient]="gradient"
				   [isActive]="isActive(bar.data)"
				   (activate)="activate.emit($event)"
				   (deactivate)="deactivate.emit($event)">
			</svg:g>
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
export class BarSeriesHorizontalLabeledComponent implements OnChanges {
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
			const formattedLabel = formatLabel(d.name);
			const roundEdges = false; // this.type === 'standard';
			const fontSize = '11px';
			const labelPadding = 3;
			let barHeight = 11;
			let bar: any = {
				value,
				label: d.name,
				roundEdges,
				data: d,
				formattedLabel,
				fontSize,
				barHeight,
				barY: 0,
				x: 0,
				y: 0,
				id: d.id
			};
			bar.height = Math.min(100, this.yScale.bandwidth());
			let fontsize = Math.min(Math.round(bar.height / 2), 11);
			bar.fontSize = fontsize + 'px';
			bar.barHeight = bar.height - fontsize - labelPadding;

			if (this.type === 'standard') {
				bar.width = Math.abs(this.xScale(value) - this.xScale(0));
				if (value < 0) {
					bar.x = this.xScale(value);
				} else {
					bar.x = this.xScale(0);
				}
				bar.y = this.yScale(d.id || d.name);
				bar.barY = bar.y + labelPadding;
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
				bar.color = this.colors.getColor(d.id || d.name);
			} else {
				if (this.type === 'standard') {
					bar.color = this.colors.getColor(value);
					if (this.gradient) {
						bar.gradientStops = this.colors.getLinearGradientStops(value);
					}
				} else {
					bar.color = this.colors.getColor(bar.offset1);
					if (this.gradient) {
						bar.gradientStops = this.colors.getLinearGradientStops(bar.offset1, bar.offset0);
					}
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
