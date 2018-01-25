import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';
import {calculateViewDimensions} from '../utils/view-dimensions.helper';
import {BasePieChartComponent} from './pie-chart-base.component';
import {IChartPieSettings, IChartData} from '../chart.interface';

@Component({
	selector: 'ngx-charts-advanced-pie-chart',
	template: `
		<div
				[style.width.px]="viewDim.width"
				[style.height.px]="viewDim.height">
			<div class="advanced-pie chart"
				 [style.width.px]="viewDim.width"
				 [style.height.px]="viewDim.height">
				<ngx-charts-chart [dim]="dim" [chart]="chart" [data]="data" [clickable]="clickable">
					<svg:g
							[attr.transform]="transform"
							class="pie chart">
						<svg:g ngx-charts-pie-series
							   [colors]="colors"
							   [showLabels]="chart.labels"
							   [series]="data"
							   [innerRadius]="innerRadius"
							   [activeEntries]="activeEntries"
							   [outerRadius]="outerRadius"
							   [gradient]="chart.gradient"
							   (select)="onClick($event)">
						</svg:g>
					</svg:g>
				</ngx-charts-chart>
			</div>
			<div class="advanced-pie-legend-wrapper"
				 [style.width.px]="legendWidth - viewDim.width">
				<ngx-charts-advanced-legend
						[data]="data"
						[colors]="colors"
						[width]="legendWidth - viewDim.width - margin[1]"
						(select)="onClick($event)"
						(activate)="onActivate($event)"
						(deactivate)="onDeactivate($event)">
				</ngx-charts-advanced-legend>
			</div>
		</div>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['pie-chart-advanced.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PieChartAdvancedComponent extends BasePieChartComponent {
	@Input() data: Array<IChartData>;
	@Input() chart: IChartPieSettings;
	@Output() select: EventEmitter<any>;

	@Input() activeEntries: any[];
	@Output() activate: EventEmitter<any>;
	@Output() deactivate: EventEmitter<any>;

	outerRadius: number;
	innerRadius: number;
	legendWidth: number;

	update(): void {
		super.update();

		this.zone.run(() => {
			this.viewDim = calculateViewDimensions({
				width: this.dim.width * 4 / 12.0,
				height: this.dim.height,
				margins: this.margin
			});

			this.domain = this.getDomain();
			this.setColors();

			let xOffset = this.viewDim.width / 2;
			let yOffset = this.margin[0] + this.viewDim.height / 2;
			this.legendWidth = this.dim.width - this.viewDim.width - this.margin[1];

			this.outerRadius = Math.min(this.viewDim.width, this.viewDim.height) / 2.5;
			this.innerRadius = this.outerRadius * 0.75;

			this.transform = `translate(${xOffset} , ${yOffset})`;
		});
	}
}
