import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, ElementRef} from '@angular/core';
import {IChartBarsSettings, IChartData, IColorScaleType} from '../chart.interface';
import {BaseXYAxisComponent} from '../common/chart/base-axes-chart.component';
import {PlatformService} from '../common/chart/base-chart.component';
import {ILegendOptions, IDomain} from '../common/common.interface';
import {scaleBand, scaleLinear} from 'd3-scale';

@Component({
	selector: 'ngx-charts-bar-vertical',
	template: `
		<ngx-charts-chart
				[dim]="dim" [chart]="chart" [data]="data"
				[legendOptions]="legendOptions"
				[activeEntries]="activeEntries"
				[clickable]="clickable"
				(legendLabelClick)="onClick($event)"
				(legendLabelActivate)="onActivate($event)"
				(legendLabelDeactivate)="onDeactivate($event)">
			<svg:g ngx-charts-axis-label
				   *ngIf="chart.yAxis.show && chart.yAxis.showLabel"
				   [label]="chart.yAxis.label"
				   [offset]="margin[1]+10"
				   [orient]="'left-left'"
				   [height]="viewDim.height"
				   [width]="viewDim.width">
			</svg:g>
			<svg:g [attr.transform]="transform" class="bar-chart chart">
				<svg:g ngx-charts-x-axis
					   *ngIf="chart.xAxis.show"
					   [xScale]="xScale"
					   [tickFormatting]="chart.xAxis.tickFormatting"
					   [defaultHeight]="chart.xAxis.defaultHeight"
					   [minInterval]="chart.xAxis.minInterval"
					   [dims]="viewDim"
					   [showLabel]="chart.xAxis.showLabel"
					   [labelText]="chart.xAxis.label"
					   (dimensionsChanged)="updateXAxisHeight($event)">
				</svg:g>
				<svg:g ngx-charts-y-axis
					   *ngIf="chart.yAxis.show"
					   [yScale]="yScale"
					   [dims]="viewDim"
					   [tickFormatting]="chart.yAxis.tickFormatting"
					   [autoSize]="chart.yAxis.autoSize"
					   [defaultWidth]="chart.yAxis.defaultWidth"
					   [minInterval]="chart.yAxis.minInterval"
					   [showGridLines]="chart.showGridLines"
					   [showLabel]="false"
					   [labelText]="chart.yAxis.label"
					   (dimensionsChanged)="updateYAxisWidth($event)">
				</svg:g>
				<svg:g ngx-charts-series-vertical
					   [type]="chart.chartType||'standard'"
					   [xScale]="xScale"
					   [yScale]="yScale"
					   [colors]="colors"
					   [series]="data"
					   [dims]="viewDim"
					   [gradient]="chart.gradient"
					   [valueFormatting]="chart.valueFormatting"
					   [activeEntries]="activeEntries"
					   (activate)="onActivate($event)"
					   (deactivate)="onDeactivate($event)"
					   (select)="onClick($event)">
				</svg:g>
			</svg:g>
		</ngx-charts-chart>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarVerticalComponent extends BaseXYAxisComponent {
	@Input() chart: IChartBarsSettings;
	@Input() data: Array<IChartData>;
	@Input() activeEntries: any[];
	@Output() select: EventEmitter<any>;
	@Output() activate: EventEmitter<any>;
	@Output() deactivate: EventEmitter<any>;

	constructor(protected chartElement: ElementRef, protected zone: NgZone, protected cd: ChangeDetectorRef, protected platform: PlatformService) {
		super(chartElement, zone, cd, platform);
	}

	getXScale() {
		const spacing = 0.2;
		const scale = scaleBand()
			.rangeRound([0, this.viewDim.width])
			.paddingInner(spacing)
			.domain(this.xDomain.map(i => {
				return <string>i;
			}));
		return scale;
	}

	getYScale() {
		const scale = scaleLinear()
			.range([this.viewDim.height, 0])
			.domain(<Array<number>>this.yDomain);
		return scale;
	}

	getXDomain(): IDomain {
		return this.data.map(d => d.name);
	}

	getYDomain(): IDomain {
		let values = this.data.map(d => d.value);
		let min = Math.min(0, ...values);
		let max = Math.max(...values);
		return [min, max];
	}

	getLegendOptions(): ILegendOptions {
		return {
			colors: this.colors,
			domain: this.getColorDomain()
		};
	}

	getColorDomain(): IDomain {
		return (this.chart.colorScheme.scaleType === IColorScaleType.Ordinal) ? this.yDomain : this.xDomain;
	}
}
