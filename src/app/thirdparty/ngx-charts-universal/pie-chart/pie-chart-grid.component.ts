import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {calculateViewDimensions} from '../utils/view-dimensions.helper';
import {gridLayout} from '../utils/grid.helper';
import {trimLabel, formatLabel} from '../utils/label.helper';
import {IChartPieSettings} from '../chart.interface';
import {BasePieChartComponent} from './pie-chart-base.component';
import {getTooltipLabeledText} from '../common/tooltip/tooltip.helper';
import {min} from 'd3-array';

@Component({
	selector: 'ngx-charts-pie-grid',
	template: `
		<ngx-charts-chart [dim]="dim" [chart]="chart" [data]="data" [clickable]="clickable">
			<svg:g [attr.transform]="transform" class="pie-grid chart">
				<svg:g *ngFor="let series of series"
					   class="pie-grid-item"
					   [attr.transform]="series.transform">
					<svg:g ngx-charts-pie-grid-series
						   [data]="series.data"
						   [innerRadius]="series.innerRadius"
						   [outerRadius]="series.outerRadius"
						   (select)="onClick($event)"
						   ngx-tooltip
						   [tooltipPlacement]="'top'"
						   [tooltipType]="'tooltip'"
						   [tooltipTitle]="getTooltipText(series.label, series.value.toLocaleString())"
					/>
					<svg:text
							class="label percent-label"
							dy="-0.5em"
							x="0"
							y="5"
							ngx-charts-count-up
							[countTo]="series.percent"
							[countSuffix]="'%'"
							text-anchor="middle">
					</svg:text>
					<svg:text
							class="label"
							dy="0.5em"
							x="0"
							y="5"
							text-anchor="middle">
						{{series.label}}
					</svg:text>
					<svg:text
							class="label"
							dy="1.23em"
							x="0"
							[attr.y]="series.outerRadius"
							text-anchor="middle"
							ngx-charts-count-up
							[countTo]="series.total"
							[countPrefix]="'Total: '">
					</svg:text>
				</svg:g>
			</svg:g>
		</ngx-charts-chart>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['pie-chart-grid.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PieGridComponent extends BasePieChartComponent {
	@Input() chart: IChartPieSettings;
	@Input() activeEntries: any[];
	@Output() select: EventEmitter<any>;
	@Output() activate: EventEmitter<any>;
	@Output() deactivate: EventEmitter<any>;

	series: any[] = [];
	data: any[];
	getTooltipText = getTooltipLabeledText;

	update(): void {
		super.update();

		this.zone.run(() => {
			this.viewDim = calculateViewDimensions({
				width: this.dim.width,
				height: this.dim.height,
				margins: this.margin
			});

			this.domain = this.getDomain();

			this.data = gridLayout(this.viewDim, this.data, 150);
			this.transform = `translate(${this.margin[3]} , ${this.margin[0]})`;

			this.series = this.getSeries();
			this.setColors();
		});
	}

	getSeries(): any[] {
		let total = this.getTotal();
		return this.data.map((d) => {
			const baselineLabelHeight = 20;
			const padding = 10;
			const label = formatLabel(d.data.name);
			const value = d.data.value;
			const radius = (min([d.width - padding, d.height - baselineLabelHeight]) / 2) - 5;
			const innerRadius = radius * 0.9;

			let count = 0;
			const colors = () => {
				count += 1;
				if (count === 1) {
					return 'rgba(100,100,100,0.3)';
				} else {
					return this.colors.getColor(label);
				}
			};

			const xPos = d.x + (d.width - padding) / 2;
			const yPos = d.y + (d.height - baselineLabelHeight) / 2;

			return {
				transform: `translate(${xPos}, ${yPos})`,
				colors,
				innerRadius,
				outerRadius: radius,
				label: trimLabel(label),
				total: value,
				value,
				percent: d.data.percent + '%',
				data: [d, {
					data: {
						other: true,
						value: total - value,
						name: d.data.name
					}
				}]
			};
		});
	}

	getTotal(): any {
		return this.data
			.map(d => d.value)
			.reduce((sum, d) => {
				return sum + d;
			}, 0);
	}

}
