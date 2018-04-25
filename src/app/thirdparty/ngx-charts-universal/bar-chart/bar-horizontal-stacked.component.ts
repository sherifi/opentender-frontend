import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
// import {animate, style, transition, trigger} from '@angular/animations';
import {BaseBarGroupedComponent} from './base-bar-grouped-chart.component';
import {IChartBarsSettings, IChartData} from '../chart.interface';
import {scaleBand, scaleLinear} from 'd3-scale';

@Component({
	selector: 'ngx-charts-bar-horizontal-stacked',
	template: `
		<ngx-charts-chart
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
					   [showLabel]="chart.yAxis.showLabel"
					   [autoSize]="chart.yAxis.autoSize"
					   [labelText]="chart.yAxis.label"
					   (dimensionsChanged)="updateYAxisWidth($event)">
				</svg:g>
				<svg:g
						*ngFor="let group of data; trackBy:trackBy"
						[attr.transform]="groupTransform(group)">
					<svg:g ngx-charts-series-horizontal
						   [type]="chart.chartType||'stacked'"
						   [xScale]="xScale"
						   [yScale]="yScale"
						   [colors]="colors"
						   [series]="group.series"
						   [activeEntries]="activeEntries"
						   [dims]="viewDim"
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
export class BarHorizontalStackedComponent extends BaseBarGroupedComponent {
	@Input() chart: IChartBarsSettings;
	@Input() data: Array<IChartData>;
	@Input() activeEntries: any[];
	@Output() select: EventEmitter<any>;
	@Output() activate: EventEmitter<any>;
	@Output() deactivate: EventEmitter<any>;

	xScale;
	yScale;

	setScales(): void {
		this.xScale = this.getXScale();
		this.yScale = this.getYScale();
	}

	getYScale() {
		const spacing = 0.1;
		const scale = scaleBand()
			.rangeRound([this.viewDim.height, 0])
			.paddingInner(spacing)
			.domain(this.groupDomain);
		return scale;
	}

	getXScale() {
		const scale = scaleLinear()
			.range([0, this.viewDim.width])
			.domain(this.valueDomain);
		return scale;
	}

	groupTransform(group: IChartData): string {
		return `translate(0, ${this.yScale(group.name)})`;
	}

}
