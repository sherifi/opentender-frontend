import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
// import {animate, style, transition, trigger} from '@angular/animations';
import {BaseBarGroupedComponent} from './base-bar-grouped-chart.component';
import {IChartBarsSettings, IChartData} from '../chart.interface';
import {scaleBand, scaleLinear} from 'd3-scale';

@Component({
	selector: 'ngx-charts-bar-vertical-stacked',
	template: `<ngx-charts-chart
        [dim]="dim" [chart]="chart" [data]="data"
		[legendOptions]="legendOptions"
		[activeEntries]="activeEntries"
		[clickable]="clickable"
		(legendLabelActivate)="onActivate($event)"
		(legendLabelDeactivate)="onDeactivate($event)"
		(legendLabelClick)="onClick($event)">
	<svg:g [attr.transform]="transform" class="bar-chart chart">
		<svg:g ngx-charts-x-axis
			   *ngIf="chart.xAxis.show"
			   [xScale]="xScale"
			   [dims]="viewDim"
			   [showGridLines]="chart.showGridLines"
			   [showLabel]="chart.xAxis.showLabel"
			   [labelText]="chart.xAxis.label"
			   (dimensionsChanged)="updateXAxisHeight($event)">
		</svg:g>
		<svg:g ngx-charts-y-axis
			   *ngIf="chart.yAxis.show"
			   [yScale]="yScale"
			   [dims]="viewDim"
			   [autoSize]="chart.yAxis.autoSize"
			   [showLabel]="chart.yAxis.showLabel"
			   [labelText]="chart.yAxis.label"
			   (dimensionsChanged)="updateYAxisWidth($event)">
		</svg:g>
		<svg:g
				*ngFor="let group of data; trackBy:trackBy"
				[attr.transform]="groupTransform(group)">
			<svg:g ngx-charts-series-vertical
				   [type]="chart.chartType||'stacked'"
				   [xScale]="xScale"
				   [yScale]="yScale"
				   [activeEntries]="activeEntries"
				   [colors]="colors"
				   [series]="group.series"
				   [dims]="viewDim"
				   [gradient]="chart.gradient"
				   (select)="onClick($event, group)"
				   (activate)="onActivate($event, group)"
				   (deactivate)="onDeactivate($event, group)"
			/>
		</svg:g>
	</svg:g>
</ngx-charts-chart>
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
export class BarVerticalStackedComponent extends BaseBarGroupedComponent {
	@Input() chart: IChartBarsSettings;
	@Input() data: Array<IChartData>;
	@Input() activeEntries: any[];
	@Output() select: EventEmitter<any>;
	@Output() activate: EventEmitter<any>;
	@Output() deactivate: EventEmitter<any>;

	xScale;
	yScale;

	setScales() {
		this.xScale = this.getXScale();
		this.yScale = this.getYScale();
	}

	getXScale() {
		let spacing = 0.1;
		const scale = scaleBand()
			.rangeRound([0, this.viewDim.width])
			.paddingInner(spacing)
			.domain(this.groupDomain);
		return scale;
	}

	getYScale() {
		const scale = scaleLinear()
			.range([this.viewDim.height, 0])
			.domain(this.valueDomain);
		return scale;
	}

	groupTransform(group: IChartData) {
		return `translate(${this.xScale(group.name)}, 0)`;
	}

}
