import {Input, Output, EventEmitter} from '@angular/core';
import {BaseChartComponent} from '../common/chart/base-chart.component';
import {calculateViewDimensions, ViewDimensions} from '../utils/view-dimensions.helper';
import {IChartBarsSettings, IChartData, IColorScaleType} from '../chart.interface';
import {ColorHelper} from '../utils/color.helper';
import {formatDates} from '../utils/data.helper';
import {IDomain, ILegendOptions} from '../common/common.interface';

export class BaseBarGroupedComponent extends BaseChartComponent {
	@Input() chart: IChartBarsSettings;
	@Input() data: Array<IChartData>;
	@Input() activeEntries: any[];
	@Output() select: EventEmitter<any>;
	@Output() activate: EventEmitter<any>;
	@Output() deactivate: EventEmitter<any>;

	viewDim: ViewDimensions;
	margin: any[] = [10, 10, 10, 10];
	xAxisHeight: number = 0;
	yAxisWidth: number = 0;

	colors: ColorHelper;
	groupDomain: any[];
	innerDomain: any[];
	valueDomain: any[];
	transform: string;
	legendOptions: any;

	getGroupDomain(): any[] {
		let domain = [];
		if (this.data) {
			for (let group of this.data) {
				if (domain.indexOf(group.name) < 0) {
					domain.push(group.name);
				}
			}
		}
		return domain;
	}

	getInnerDomain(): any[] {
		let domain = [];

		if (this.data) {
			for (let group of this.data) {
				for (let d of group.series) {
					if (domain.indexOf(d.name) < 0) {
						domain.push(d.name);
					}
				}
			}
		}

		return domain;
	}

	getValueDomain(): IDomain {
		let domain = [];
		if (this.data) {
			for (let group of this.data) {
				// let sum = 0;
				let groupdomain = [];
				for (let d of group.series) {
					groupdomain.push(d.value);
					// sum += d.value;
				}
				domain.push(Math.max(...groupdomain));
			}
		}
		let min = Math.min(0, ...domain);
		let max = Math.max(...domain);
		return [min, max];
	}

	setScales(): void {

	}

	updateViewDim(): void {
		this.viewDim = calculateViewDimensions({
			width: this.dim.width,
			height: this.dim.height,
			margins: this.margin,
			showXAxis: this.chart.xAxis.show,
			showYAxis: this.chart.yAxis.show,
			xAxisHeight: this.xAxisHeight,
			yAxisWidth: this.yAxisWidth || this.chart.yAxis.defaultWidth,
			showXLabel: this.chart.xAxis.showLabel,
			showYLabel: this.chart.yAxis.showLabel,
			showLegend: this.chart.legend && this.chart.legend.show,
			legendType: this.chart.colorScheme.scaleType
		});
	}

	update(): void {
		super.update();

		this.zone.run(() => {
			this.updateViewDim();

			if (this.data) {
				formatDates(this.data);
			}
			this.groupDomain = this.getGroupDomain();
			this.innerDomain = this.getInnerDomain();
			this.valueDomain = this.getValueDomain();

			this.setScales();

			this.setColors();
			this.legendOptions = this.getLegendOptions();

			this.transform = `translate(${ this.viewDim.xOffset } , ${ this.margin[0] })`;
		});
	}

	onClick(data, group?) {
		if (group) {
			data.source_series = group.name;
		}
		this.select.emit(data);
	}

	trackBy(index, item): string {
		return item.id || item.name;
	}

	setColors(): void {
		this.colors = ColorHelper.fromColorSet(this.chart.colorScheme, this.getColorDomain());
	}

	getColorDomain(): IDomain {
		return this.chart.colorScheme.scaleType === IColorScaleType.Ordinal ? this.innerDomain : this.valueDomain;
	}

	getLegendOptions(): ILegendOptions {
		return {
			colors: this.colors,
			domain: this.getColorDomain()
		};
	}

	updateYAxisWidth({width}): void {
		this.yAxisWidth = width;
		this.update();
	}

	updateXAxisHeight({height}): void {
		this.xAxisHeight = height;
		this.update();
	}

}
