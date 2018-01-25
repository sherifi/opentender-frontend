import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewEncapsulation, ElementRef, NgZone, ChangeDetectorRef} from '@angular/core';
import {calculateViewDimensions, ViewDimensions} from '../utils/view-dimensions.helper';
import {gridLayout} from '../utils/grid.helper';
import {formatLabel, splitLabel} from '../utils/label.helper';
import {IChartData, IChartPieSeriesSettings} from '../chart.interface';
import {getTooltipLabeledText} from '../common/tooltip/tooltip.helper';
import {min} from 'd3-array';
import {BaseChartComponent} from '../common/chart/base-chart.component';
import {ColorHelper} from '../utils/color.helper';
import {IDomain} from '../common/common.interface';
import {PlatformService} from '../../../services/platform.service';

@Component({
	selector: 'ngx-charts-values-grid',
	template: `
		<ngx-charts-chart [dim]="dim" [chart]="chart" [data]="data" [clickable]="clickable">
			<svg:g [attr.transform]="transform" class="values-grid chart">
				<svg:g *ngFor="let serie of series"
					   class="values-grid-item"
					   [attr.transform]="serie.transform"
					   ngx-tooltip
					   [tooltipPlacement]="'top'"
					   [tooltipType]="'tooltip'"
					   [tooltipTitle]="getTooltipText(serie.label, serie.formattedLabelNumber)">
					<svg:rect style="stroke: none; fill: #fff; opacity:0" [attr.x]="-serie.outerRadius" [attr.y]="-serie.outerRadius" [attr.height]="serie.outerRadius*2" [attr.width]="serie.outerRadius*2"/>
					<svg:g ngx-charts-values-grid-series
						   [data]="serie.data"
						   [innerRadius]="serie.innerRadius"
						   [outerRadius]="serie.outerRadius"
						   (select)="onClick($event)"
					/>
					<svg:text
							class="label value-label"
							dy="-0.5em"
							[attr.x]="serie.labelLeft"
							[attr.y]="serie.labelTop"
							[style.font-size.pt]="serie.fontSize"
							text-anchor="middle">{{serie.formattedLabelNumber}}
					</svg:text>
					<svg:text *ngIf="chart.labels"
							  class="label"
							  dy="1.23em"
							  x="0"
							  [attr.y]="serie.outerRadius"
							  text-anchor="middle">
						<svg:tspan *ngFor="let text of serie.labels" x="0" dy="13">{{text}}</svg:tspan>
					</svg:text>
				</svg:g>
			</svg:g>
		</ngx-charts-chart>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['values-grid.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ValuesGridComponent extends BaseChartComponent {
	@Input() data: Array<IChartData>;
	@Input() chart: IChartPieSeriesSettings;
	@Input() activeEntries: any[];
	@Output() select: EventEmitter<any>;
	@Output() activate: EventEmitter<any>;
	@Output() deactivate: EventEmitter<any>;

	colors: ColorHelper;
	domain: IDomain;
	transform: string;
	margin = [10, 10, 10, 10];
	series: any[] = [];
	getTooltipText = getTooltipLabeledText;

	constructor(protected chartElement: ElementRef, protected zone: NgZone, protected cd: ChangeDetectorRef, protected platform: PlatformService) {
		super(chartElement, zone, cd, platform);
		this.transform = `translate(${this.margin[3]} , ${this.margin[0]})`;
	}

	onClick(data): void {
		this.select.emit(data);
	}

	getDomain(): IDomain {
		return this.data.map(d => d.name);
	}

	update(): void {
		super.update();
		this.series = [];

		if (this.data) {
			this.domain = this.getDomain();
			let viewDim = calculateViewDimensions({
				width: this.dim.width,
				height: this.dim.height,
				margins: this.margin
			});
			let colors = ColorHelper.fromColorSet(this.chart.colorScheme, this.domain);
			let series = this.getSeries(gridLayout(viewDim, this.data, 150), colors);
			this.zone.run(() => {
				this.series = series;
			});
		}
	}

	formatLabelNumber(value: number): string {
		return this.chart && this.chart.valueFormatting ? this.chart.valueFormatting(value) : value.toLocaleString();
	}

	getSeries(layout_data, colors): any[] {
		return layout_data.map((d) => {
			const baselineLabelHeight = this.chart.labels ? 20 : 0;
			const padding = 10;
			const label = formatLabel(d.data.name);
			const value = d.data.value;
			let radius = (min([d.width - padding, d.height - baselineLabelHeight]) / 2) - 5;
			if (this.chart.maxRadius > 0) {
				radius = Math.min(radius, this.chart.maxRadius);
			}
			radius = Math.max(0, radius);
			const innerRadius = radius * 0.9;
			const xPos = d.x + (d.width - padding) / 2;
			const yPos = d.y + (d.height - baselineLabelHeight) / 2;
			const fontSize = Math.max(Math.min(24, radius / 2), 8);
			const labelTop = (fontSize * 1.1);
			const labelLeft = innerRadius < 10 ? (radius * 3) : 0;
			d.data.color = d.data.color || colors.getColor(d.data.value);
			return {
				transform: `translate(${xPos}, ${yPos})`,
				innerRadius,
				outerRadius: radius,
				label,
				labels: labelLeft ? [label] : splitLabel(label),
				total: this.chart.maxValue,
				formattedLabelNumber: this.formatLabelNumber(value),
				value,
				fontSize,
				labelTop,
				labelLeft,
				data: [d, {
					data: {
						other: true,
						value: this.chart.maxValue - value,
						color: 'rgba(100,100,100,0.2)',
						name: d.data.name
					}
				}]
			};
		});
	}

}
