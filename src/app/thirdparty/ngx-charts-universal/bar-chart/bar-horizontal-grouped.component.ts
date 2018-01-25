import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
// import {animate, style, transition, trigger} from '@angular/animations';
import {BaseBarGroupedComponent} from './base-bar-grouped-chart.component';
import {IChartBarsSettings, IChartData} from '../chart.interface';
import {scaleBand, scaleLinear} from 'd3-scale';

@Component({
	selector: 'ngx-charts-bar-horizontal-grouped',
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
				<svg:g ngx-charts-grid-panel-series
					   [xScale]="valueScale"
					   [yScale]="groupScale"
					   [data]="data"
					   [dims]="viewDim"
					   orient="horizontal">
				</svg:g>
				<svg:g ngx-charts-x-axis
					   *ngIf="chart.xAxis.show"
					   [xScale]="valueScale"
					   [dims]="viewDim"
					   [showGridLines]="chart.showGridLines"
					   [showLabel]="chart.xAxis.showLabel"
					   [labelText]="chart.xAxis.label"
					   (dimensionsChanged)="updateXAxisHeight($event)">
				</svg:g>
				<svg:g ngx-charts-y-axis
					   *ngIf="chart.yAxis.show"
					   [yScale]="groupScale"
					   [dims]="viewDim"
					   [showLabel]="chart.yAxis.showLabel"
					   [labelText]="chart.yAxis.label"
					   [autoSize]="chart.yAxis.autoSize"
					   (dimensionsChanged)="updateYAxisWidth($event)">
				</svg:g>
				<svg:g
						*ngFor="let group of data; trackBy:trackBy"
						[attr.transform]="groupTransform(group)">
					<svg:g ngx-charts-series-horizontal
						   [xScale]="valueScale"
						   [activeEntries]="activeEntries"
						   [yScale]="innerScale"
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
export class BarHorizontalGroupedComponent extends BaseBarGroupedComponent {
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
		const spacing = 0.2;
		const scale = scaleBand()
			.rangeRound([this.viewDim.height, 0])
			.paddingInner(spacing)
			.paddingOuter(spacing / 2)
			.domain(this.groupDomain);
		return scale;
	}

	getInnerScale() {
		const spacing = 0.2;
		const scale = scaleBand()
			.rangeRound([0, this.groupScale.bandwidth()])
			.paddingInner(spacing)
			.domain(this.innerDomain);
		return scale;
	}

	getValueScale() {
		const scale = scaleLinear()
			.range([0, this.viewDim.width])
			.domain(this.valueDomain);
		return scale;
	}

	groupTransform(group: IChartData): string {
		return `translate(0, ${this.groupScale(group.name)})`;
	}

}
