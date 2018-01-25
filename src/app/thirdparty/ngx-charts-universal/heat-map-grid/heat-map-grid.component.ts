import {Component, Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef, NgZone, ElementRef} from '@angular/core';
import {BaseXYAxisComponent} from '../common/chart/base-axes-chart.component';
import {IChartHeatmapSettings, IChartData, IColorScaleType} from '../chart.interface';
import {ColorHelper} from '../utils/color.helper';
import {calculateViewDimensions} from '../utils/view-dimensions.helper';
import {IDomain, ILegendOptions} from '../common/common.interface';
import {formatDates} from '../utils/data.helper';
import {PlatformService} from '../../../services/platform.service';
import {scaleBand} from 'd3-scale';

interface IRect {
	x: number;
	y: number;
	rx: number;
	width: number;
	height: number;
	fill: string;
}

@Component({
	selector: 'ngx-charts-heat-map-grid',
	template: `
		<ngx-charts-chart
				[dim]="dim" [chart]="chart" [data]="data"
				[clickable]="clickable"
				[legendOptions]="legendOptions"
				(legendLabelActivate)="onActivate($event)"
				(legendLabelDeactivate)="onDeactivate($event)"
				(legendLabelClick)="onClick($event)">
			<svg:g [attr.transform]="transform" class="heat-map chart">
				<svg:g ngx-charts-x-axis
					   *ngIf="chart.xAxis.show"
					   [xScale]="xScale"
					   [dims]="viewDim"
					   [showLabel]="chart.xAxis.showLabel"
					   [showGridLines]="chart.showGridLines"
					   [showLabel]="chart.xAxis.showLabel"
					   [defaultHeight]="chart.xAxis.defaultHeight"
					   [labelText]="chart.xAxis.label"
					   [tickFormatting]="chart.xAxis.tickFormatting"
					   [minInterval]="chart.xAxis.minInterval"
					   (dimensionsChanged)="updateXAxisHeight($event)"></svg:g>
				<svg:g ngx-charts-y-axis
					   *ngIf="chart.yAxis.show"
					   [yScale]="yScale"
					   [dims]="viewDim"
					   [tickFormatting]="chart.yAxis.tickFormatting"
					   [autoSize]="chart.yAxis.autoSize"
					   [defaultWidth]="chart.yAxis.defaultWidth"
					   [minInterval]="chart.yAxis.minInterval"
					   [showGridLines]="chart.showGridLines"
					   [showLabel]="chart.yAxis.showLabel"
					   [labelText]="chart.yAxis.label"
					   (dimensionsChanged)="updateYAxisWidth($event)"></svg:g>
				<svg:rect *ngFor="let rect of rects"
						  [attr.x]="rect.x"
						  [attr.y]="rect.y"
						  [attr.rx]="rect.rx"
						  [attr.width]="rect.width"
						  [attr.height]="rect.height"
						  [attr.fill]="rect.fill"
						  ngx-tooltip
						  [tooltipPlacement]="'top'"
						  [tooltipType]="'tooltip'"
						  [tooltipTitle]="getRectTooltipText(rect)"
				/>
				<svg:g ngx-charts-heat-map-circle-cell-series
					   [xScale]="xScale"
					   [yScale]="yScale"
					   [colors]="colors"
					   [valueFormatting]="chart.valueFormatting"
					   [data]="data"
					   [no_data]="chart.i18n.no_data"
					   (select)="onClick($event)"
				/>
			</svg:g>
		</ngx-charts-chart>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeatMapGridComponent extends BaseXYAxisComponent {
	@Input() chart: IChartHeatmapSettings;
	@Input() data: Array<IChartData>;
	@Input() marker: {
		group: string;
		name: string;
		value: number;
		toolTipFormat: (marker) => string;
	};
	@Input() activeEntries: any[];
	@Output() select: EventEmitter<any>;
	@Output() activate: EventEmitter<any>;
	@Output() deactivate: EventEmitter<any>;

	rects: Array<IRect>;

	constructor(protected chartElement: ElementRef, protected zone: NgZone, protected cd: ChangeDetectorRef, protected platform: PlatformService) {
		super(chartElement, zone, cd, platform);
	}

	updateDomains(): void {
		// this.valueDomain = this.getValueDomain();
		// this.seriesDomain = this.getXDomain();
	}

	updateViewDim(): void {
		this.viewDim = calculateViewDimensions({
			width: this.dim.width,
			height: this.dim.height,
			margins: this.margin,
			showXAxis: this.chart.xAxis.show,
			showYAxis: this.chart.yAxis.show,
			xAxisHeight: this.xAxisHeight,
			yAxisWidth: this.yAxisWidth,
			showXLabel: this.chart.xAxis.showLabel,
			showYLabel: this.chart.yAxis.showLabel,
			showLegend: this.chart.legend && this.chart.legend.show,
			legendType: this.chart.colorScheme.scaleType
		});
	}

	update(): void {
		if (this.data) {
			formatDates(this.data);
		}
		super.update();
		this.rects = this.getRects();
	}

	getXDomain(): IDomain {
		let domain = [];
		for (let group of this.data) {
			if (domain.indexOf(group.name) < 0) {
				domain.push(group.name);
			}
		}
		return domain;
	}

	getYDomain(): IDomain {
		let domain = [];
		for (let group of this.data) {
			for (let d of group.series) {
				if (domain.indexOf(d.name) < 0) {
					domain.push(d.name);
				}
			}
		}
		return domain;
	}

	getValueDomain(): IDomain {
		let domain = [];
		for (let group of this.data) {
			for (let d of group.series) {
				if (domain.indexOf(d.value) < 0) {
					domain.push(d.value);
				}
			}
		}
		let min = Math.min(0, ...domain);
		let max = Math.max(...domain);
		return [min, max];
	}

	getXScale() {
		const scale = scaleBand<number>()
			.rangeRound([0, this.viewDim.width])
			.paddingInner(0.1)
			.domain(this.xDomain.map(i => {
				return i;
			}));
		return scale;
	}

	getYScale() {
		const scale = scaleBand<number>()
			.rangeRound([this.viewDim.height, 0])
			.paddingInner(0.1)
			.domain(this.yDomain.map(i => {
				return i;
			}));
		return scale;
	}

	getColorDomain(): IDomain {
		return this.chart.colorScheme.scaleType === IColorScaleType.Ordinal ? this.getYDomain() : this.getXDomain();
	}

	setColors(): void {
		this.colors = ColorHelper.fromColorSet(this.chart.colorScheme, this.getColorDomain());
	}

	getLegendOptions(): ILegendOptions {
		return {
			domain: this.getColorDomain(),
			colors: this.colors
		};
	}

	getRects(): Array<IRect> {
		let rects: Array<IRect> = [];
		if (this.xDomain) {
			this.xDomain.map((xVal) => {
				this.yDomain.map((yVal) => {
					let isMarked = (this.marker && this.marker.name === xVal && this.marker.group === yVal);
					if (isMarked) {
						rects.push({
							x: this.xScale(xVal),
							y: this.yScale(yVal),
							rx: 3,
							width: this.xScale.bandwidth(),
							height: this.yScale.bandwidth(),
							fill: 'rgba(200,200,200,0.8)'
						});
					}
				});
			});
		}
		if (rects.length === 0 && this.marker && this.marker.name) {
			rects.push({
				x: this.xScale(this.marker.name),
				y: 0,
				rx: 3,
				width: this.xScale.bandwidth(),
				height: this.viewDim.height,
				fill: 'rgba(200,200,200,0.8)'
			});
		}
		return rects;
	}

	getRectTooltipText(rect) {
		if (this.marker) {
			if (this.marker.toolTipFormat) {
				return this.marker.toolTipFormat(this.marker);
			}
		}
		return '';
	}

}
