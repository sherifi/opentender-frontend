import {Component, Input, Output, EventEmitter, HostListener, ChangeDetectionStrategy, ElementRef, NgZone, ChangeDetectorRef} from '@angular/core';
import {UrlId} from '../utils/id.helper';
import {IChartLineSettings, IChartData, IColorScaleType, IScaleType} from '../chart.interface';
import {BaseXYAxisComponent} from '../common/chart/base-axes-chart.component';
import {PlatformService} from '../common/chart/base-chart.component';
import {IDomain, ILegendOptions} from '../common/common.interface';
import {toDate, isDate} from '../utils/date.helper';
import {scaleLinear, scaleTime, scalePoint} from 'd3-scale';
import {curveLinear} from 'd3-shape';

@Component({
	selector: 'ngx-charts-line-chart',
	template: `
		<ngx-charts-chart
				[dim]="dim" [chart]="chart" [data]="data"
				[legendOptions]="legendOptions"
				[activeEntries]="activeEntries"
				[clickable]="clickable"
				(legendLabelClick)="onClick($event)"
				(legendLabelActivate)="onActivate($event)"
				(legendLabelDeactivate)="onDeactivate($event)">
			<svg:defs>
				<svg:clipPath [attr.id]="clipId.id">
					<svg:rect
							[attr.width]="viewDim.width + 10"
							[attr.height]="viewDim.height + 10"
							[attr.transform]="'translate(-5, -5)'"/>
				</svg:clipPath>
			</svg:defs>
			<svg:g [attr.transform]="transform" class="line-chart chart">
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
					   [showGridLines]="chart.showGridLines"
					   [showLabel]="chart.yAxis.showLabel"
					   [labelText]="chart.yAxis.label"
					   (dimensionsChanged)="updateYAxisWidth($event)">
				</svg:g>
				<svg:g [attr.clip-path]="clipId.url">
					<svg:g *ngFor="let series of data; trackBy:trackBy">
						<svg:g ngx-charts-line-series
							   [xScale]="xScale"
							   [yScale]="yScale"
							   [colors]="colors"
							   [data]="series"
							   [activeEntries]="activeEntries"
							   [scaleType]="scaleType"
							   [curve]="curve"
						/>
					</svg:g>
					<svg:g ngx-charts-area-tooltip
						   [xSet]="xSet"
						   [xScale]="xScale"
						   [yScale]="yScale"
						   [results]="data"
						   [height]="viewDim.height"
						   [colors]="colors"
						   (hover)="updateHoveredVertical($event)"
					/>
					<svg:g *ngFor="let series of data">
						<svg:g ngx-charts-circle-series
							   [xScale]="xScale"
							   [yScale]="yScale"
							   [colors]="colors"
							   [data]="series"
							   [scaleType]="scaleType"
							   [visibleValue]="hoveredVertical"
							   [activeEntries]="activeEntries"
							   (select)="onClick($event, series)"
							   (activate)="onActivate($event)"
							   (deactivate)="onDeactivate($event)"
						/>
					</svg:g>
				</svg:g>
			</svg:g>
			<svg:g ngx-charts-timeline
				   *ngIf="data && isTime()"
				   [attr.transform]="timelineTransform"
				   [results]="data"
				   [view]="[timelineWidth, dim.height]"
				   [height]="timelineHeight"
				   [scheme]="chart.colorScheme"
				   [scaleType]="scaleType"
				   [legend]="chart.legend && chart.legend.show"
				   (onDomainChange)="updateDomain($event)">
				<svg:g *ngFor="let series of data; trackBy:trackBy">
					<svg:g ngx-charts-line-series
						   [xScale]="timelineXScale"
						   [yScale]="timelineYScale"
						   [colors]="colors"
						   [data]="series"
						   [scaleType]="scaleType"
						   [curve]="curve"
					/>
				</svg:g>
			</svg:g>
		</ngx-charts-chart>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent extends BaseXYAxisComponent {
	@Input() data: Array<IChartData>;
	@Input() chart: IChartLineSettings;
	@Output() select: EventEmitter<any>;
	@Input() activeEntries: any[];
	@Output() activate: EventEmitter<any>;
	@Output() deactivate: EventEmitter<any>;

	curve = curveLinear;
	xSet: IDomain;
	seriesDomain: IDomain;
	scaleType: IScaleType;
	transform: string;
	hoveredVertical: any; // the value of the x axis that is hovered over
	filteredDomain: IDomain;
	clipId = new UrlId();

	timelineWidth: number;
	timelineHeight = 50;
	timelineXScale;
	timelineYScale;
	timelineXDomain: IDomain;
	timelineTransform: string;
	timelinePadding = 10;

	constructor(protected chartElement: ElementRef, protected zone: NgZone, protected cd: ChangeDetectorRef, protected platform: PlatformService) {
		super(chartElement, zone, cd, platform);
	}

	updateDomains(): void {
		if (this.chart.timeline) {
			this.viewDim.height -= (this.timelineHeight + this.margin[2] + this.timelinePadding);
		}
		if (this.filteredDomain) {
			this.xDomain = this.filteredDomain;
		}
		this.seriesDomain = this.getSeriesDomain();
	}

	updateScales(): void {
		this.updateTimeline();
		this.clipId.generate('clip', this.platform.isBrowser);
	}

	isTime(): boolean {
		return this.scaleType === IScaleType.Time;
	}

	getXSet(): IDomain {
		let values = [];
		for (let group of this.data) {
			for (let d of group.series) {
				if (values.indexOf(d.name) < 0) {
					values.push(d.name);
				}
			}
		}
		return values;
	}

	getXDomain(): IDomain {
		this.xSet = this.getXSet();
		this.scaleType = this.getScaleType(this.xSet);
		let domain = [];
		if (this.scaleType === IScaleType.Time) {
			let values = this.xSet.map(v => toDate(v).valueOf());
			let min = Math.min(...values);
			let max = Math.max(...values);
			domain = [min, max];
		} else if (this.scaleType === IScaleType.Linear) {
			let values = this.xSet.map(v => Number(v));
			let min = Math.min(...values);
			let max = Math.max(...values);
			domain = [min, max];
		} else if (this.scaleType === IScaleType.Ordinal) {
			domain = this.xSet;
		}
		return domain;
	}

	getYDomain(): IDomain {
		let domain = [];

		for (let results of this.data) {
			for (let d of results.series) {
				if (domain.indexOf(d.value) < 0) {
					domain.push(d.value);
				}
			}
		}

		let min = Math.min(...domain);
		let max = Math.max(...domain);
		if (!this.chart.autoScale) {
			min = Math.min(0, min);
		}

		return [min, max];
	}

	getXScale() {
		return this._getXScale(this.xDomain, this.viewDim.width);
	}

	getYScale() {
		return this._getYScale(this.yDomain, this.viewDim.height);
	}

	getColorDomain(): IDomain {
		return (this.chart.colorScheme.scaleType === IColorScaleType.Ordinal) ? this.seriesDomain : this.yDomain;
	}

	getLegendOptions(): ILegendOptions {
		return {
			colors: this.colors,
			domain: this.getColorDomain()
		};
	}

	updateTimeline(): void {
		if (this.chart.timeline) {
			this.timelineWidth = this.dim.width;
			if (this.chart.legend && this.chart.legend.show) {
				this.timelineWidth = this.viewDim.width;
			}
			this.timelineXDomain = this.getXDomain();
			this.timelineXScale = this._getXScale(this.timelineXDomain, this.timelineWidth);
			this.timelineYScale = this._getYScale(this.yDomain, this.timelineHeight);
			this.timelineTransform = `translate(${ this.viewDim.xOffset }, ${ -this.margin[2] })`;
		}
	}

	getSeriesDomain(): IDomain {
		return this.data.map(d => d.name);
	}

	_getXScale(domain, width) {
		let scale;

		if (this.scaleType === IScaleType.Time) {
			scale = scaleTime()
				.range([0, width])
				.domain(domain);
		} else if (this.scaleType === IScaleType.Linear) {
			scale = scaleLinear()
				.range([0, width])
				.domain(domain);
		} else if (this.scaleType === IScaleType.Ordinal) {
			scale = scalePoint()
				.range([0, width])
				.padding(0.1)
				.domain(domain);
		}

		return scale;
	}

	_getYScale(domain, height) {
		const scale = scaleLinear()
			.range([height, 0])
			.domain(domain);
		return scale;
	}

	getScaleType(values: IDomain): IScaleType {
		let date = true;
		let number = true;
		for (let value of values) {
			if (!isDate(value)) {
				date = false;
			}
			if (typeof value !== 'number') {
				number = false;
			}
		}
		if (date) {
			return IScaleType.Time;
		}
		if (number) {
			return IScaleType.Linear;
		}
		return IScaleType.Ordinal;
	}

	updateDomain(domain: IDomain): void {
		this.filteredDomain = domain;
		this.xDomain = this.filteredDomain;
		this.xScale = this.getXScale();
	}

	updateHoveredVertical(item): void {
		this.hoveredVertical = item.value;
	}

	@HostListener('mouseleave')
	hideCircles(): void {
		this.hoveredVertical = null;
	}

}
