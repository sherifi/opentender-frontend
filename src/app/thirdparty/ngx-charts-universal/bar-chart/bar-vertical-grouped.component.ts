import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
// import {animate, style, transition, trigger} from '@angular/animations';
import {IChartBarsSettings, IChartData} from '../chart.interface';
import {BaseBarGroupedComponent} from './base-bar-grouped-chart.component';
import {scaleBand, scaleLinear} from 'd3-scale';

@Component({
	selector: 'ngx-charts-bar-vertical-grouped',
	template: `
		<ngx-charts-chart
				[dim]="dim" [chart]="chart" [data]="data"
				[legendOptions]="legendOptions"
				[activeEntries]="activeEntries"
				[clickable]="clickable"
				(legendLabelActivate)="onActivate($event)"
				(legendLabelDeactivate)="onDeactivate($event)"
				(legendLabelClick)="onClick($event)">
			<svg:g ngx-charts-axis-label
				   *ngIf="chart.yAxis.show && chart.yAxis.showLabel"
				   [label]="chart.yAxis.label"
				   [offset]="margin[1]+10"
				   [orient]="'left-left'"
				   [height]="viewDim.height"
				   [width]="viewDim.width">
			</svg:g>
			<svg:g [attr.transform]="transform" class="bar-chart chart">
				<svg:g ngx-charts-grid-panel-series
					   [xScale]="groupScale"
					   [yScale]="valueScale"
					   [data]="data"
					   [dims]="viewDim"
					   orient="vertical">
				</svg:g>
				<svg:g ngx-charts-x-axis
					   *ngIf="chart.xAxis.show"
					   [xScale]="groupScale"
					   [dims]="viewDim"
					   [showGridLines]="false"
					   [showLabel]="chart.xAxis.showLabel"
					   [defaultHeight]="chart.xAxis.defaultHeight"
					   [labelText]="chart.xAxis.label"
					   [tickFormatting]="chart.xAxis.tickFormatting"
					   [minInterval]="chart.xAxis.minInterval"
					   (dimensionsChanged)="updateXAxisHeight($event)">
				</svg:g>
				<svg:g ngx-charts-y-axis
					   *ngIf="chart.yAxis.show"
					   [yScale]="valueScale"
					   [dims]="viewDim"
					   [defaultWidth]="chart.yAxis.defaultWidth"
					   [showGridLines]="chart.showGridLines"
					   [showLabel]="false"
					   [autoSize]="chart.yAxis.autoSize"
					   [labelText]="chart.yAxis.label"
					   [trimLabelLength]="chart.yAxis.maxLength"
					   [tickFormatting]="chart.yAxis.tickFormatting"
					   [minInterval]="chart.yAxis.minInterval"
					   (dimensionsChanged)="updateYAxisWidth($event)">
				</svg:g>
				<svg:g ngx-charts-series-vertical
					   *ngFor="let group of data; trackBy:trackBy"
					   [attr.transform]="groupTransform(group)"
					   [activeEntries]="activeEntries"
					   [xScale]="innerScale"
					   [yScale]="valueScale"
					   [colors]="colors"
					   [series]="group.series"
					   [dims]="viewDim"
					   [gradient]="chart.gradient"
					   (select)="onClick($event, group)"
					   (activate)="onActivate($event, group)"
					   (deactivate)="onDeactivate($event, group)"
				/>
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
export class BarVerticalGroupedComponent extends BaseBarGroupedComponent {
	@Input() chart: IChartBarsSettings;
	@Input() data: Array<IChartData>;
	@Input() activeEntries: any[];
	@Output() select: EventEmitter<any>;
	@Output() activate: EventEmitter<any>;
	@Output() deactivate: EventEmitter<any>;

	groupScale;
	innerScale;
	valueScale;

	setScales() {
		this.groupScale = this.getGroupScale();
		this.innerScale = this.getInnerScale();
		this.valueScale = this.getValueScale();
	}

	getGroupScale() {
		let spacing = 0.2;
		const scale = scaleBand()
			.rangeRound([0, this.viewDim.width])
			.paddingInner(spacing)
			.paddingOuter(spacing / 2)
			.domain(this.groupDomain);
		return scale;
	}

	getInnerScale() {
		let spacing = 0.2;
		const scale = scaleBand()
			.rangeRound([0, this.groupScale.bandwidth()])
			.paddingInner(spacing)
			.domain(this.innerDomain);
		return scale;
	}

	getValueScale() {
		const scale = scaleLinear()
			.range([this.viewDim.height, 0])
			.domain(this.valueDomain);
		return scale;
	}

	groupTransform(group: IChartData) {
		return `translate(${this.groupScale(group.name)}, 0)`;
	}

}
