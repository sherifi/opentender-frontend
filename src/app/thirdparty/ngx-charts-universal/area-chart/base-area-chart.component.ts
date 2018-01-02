import {Input, Output, EventEmitter, HostListener, ElementRef, NgZone, ChangeDetectorRef} from '@angular/core';
import {IChartAreaSettings, IChartData, IColorScaleType, IScaleType} from '../chart.interface';
import {UrlId} from '../utils/id.helper';
import {PlatformService} from '../common/chart/base-chart.component';
import {BaseXYAxisComponent} from '../common/chart/base-axes-chart.component';
import {toDate} from '../utils/date.helper';
import {IDomain, ILegendOptions} from '../common/common.interface';
import {curveLinear} from 'd3-shape';
import {scaleTime, scaleLinear, scalePoint} from 'd3-scale';

export interface IAreaChartData {
	name: string | Date;
	value: number;
	d0?: number;
	d1?: number;
	series?: Array<IAreaChartData>;
}

export class BaseAreaChartComponent extends BaseXYAxisComponent {
	@Input() chart: IChartAreaSettings;
	@Input() data: Array<IChartData>;
	@Output() select: EventEmitter<any>;
	@Input() activeEntries: any[];
	@Output() activate: EventEmitter<any>;
	@Output() deactivate: EventEmitter<any>;

	@Input() curve = curveLinear;

	xSet: any[]; // the set of all values on the X Axis
	seriesDomain: IDomain;
	scaleType: IScaleType;
	hoveredVertical: any; // the value of the x axis that is hovered over
	filteredDomain: any;
	timelineWidth: any;
	timelineHeight = 50;
	timelineXScale: any;
	timelineYScale: any;
	timelineXDomain: any;
	timelineTransform: any;
	timelinePadding = 10;
	areaData: Array<IAreaChartData> = [];
	clipId = new UrlId();

	constructor(protected chartElement: ElementRef, protected zone: NgZone, protected cd: ChangeDetectorRef, protected platform: PlatformService) {
		super(chartElement, zone, cd, platform);
	}

	updateSet(): Array<IAreaChartData> {
		return null; // "abstract"
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

	getXScale() {
		return this._getXScale(this.xDomain, this.viewDim.width);
	}

	getYScale() {
		return this._getYScale(this.yDomain, this.viewDim.height);
	}

	updateScales(): void {
		this.areaData = this.updateSet();
		this.updateTimeline();
		this.clipId.generate('clip', this.platform.isBrowser);
	}

	cloneAreaData(): Array<IAreaChartData> {
		return this.data.map(item => {
			return {
				name: item.name, value: item.value, series: item.series.map(subitem => {
					return {name: subitem.name, value: subitem.value};
				})
			};
		});
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

	getXDomain(): IDomain {
		let values = [];

		for (let results of this.data) {
			for (let d of results.series) {
				if (values.indexOf(d.name) < 0) {
					values.push(d.name);
				}
			}
		}

		this.scaleType = this.getScaleType(values);
		let domain = [];

		if (this.scaleType === IScaleType.Time) {
			values = values.map(v => toDate(v));
			let min = Math.min(...values);
			let max = Math.max(...values);
			domain = [new Date(min), new Date(max)];
		} else if (this.scaleType === IScaleType.Ordinal) {
			domain = values;
		} else if (this.scaleType === IScaleType.Linear) {
			values = values.map(v => Number(v));
			let min = Math.min(...values);
			let max = Math.max(...values);
			domain = [min, max];
		}

		this.xSet = values;

		return domain;
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
		} else if (this.scaleType === IScaleType.Ordinal) {
			scale = scalePoint()
				.range([0, width])
				.padding(0.1)
				.domain(domain);
		} else if (this.scaleType === IScaleType.Linear) {
			scale = scaleLinear()
				.range([0, width])
				.domain(domain);
		}
		return scale;
	}

	_getYScale(domain: IDomain, height: number) {
		const scale = scaleLinear()
			.range([height, 0])
			.domain(domain.map(i => {
				return <number>i;
			}));
		return scale;
	}

	getScaleType(values): IScaleType {
		let date = true;
		let number = true;

		for (let value of values) {
			if (!this.isDate(value)) {
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

	isDate(value): boolean {
		return (value instanceof Date);
	}

	updateDomain(domain): void {
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

	onClick(data, series?): void {
		if (series) {
			data.series = series.name;
		}
		this.select.emit(data);
	}

	trackBy(index, item): string {
		return item.id || item.name;
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
}
