import {Input, Output, EventEmitter} from '@angular/core';
import {BaseChartComponent} from '../common/chart/base-chart.component';
import {calculateViewDimensions, ViewDimensions} from '../utils/view-dimensions.helper';
import {IChartBarsSettings, IChartData} from '../chart.interface';
import {ColorHelper} from '../utils/color.helper';
import {formatDates} from '../utils/data.helper';
import {ILegendOptions} from '../common/common.interface';

export class BaseBarGroupedComponent extends BaseChartComponent {
	@Input() chart: IChartBarsSettings;
	@Input() data: Array<IChartData>;
	@Input() activeEntries: any[];
	@Output() select: EventEmitter<any>;
	@Output() activate: EventEmitter<any>;
	@Output() deactivate: EventEmitter<any>;

	viewDim: ViewDimensions;
	margin: any[] = [10, 20, 10, 20];
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
		for (let group of this.data) {
			if (domain.indexOf(group.name) < 0) {
				domain.push(group.name);
			}
		}
		return domain;
	}

	getInnerDomain(): any[] {
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

	getValueDomain() {
		let domain = [];
		for (let group of this.data) {
			let sum = 0;
			for (let d of group.series) {
				sum += d.value;
			}

			domain.push(sum);
		}

		let min = Math.min(0, ...domain);
		let max = Math.max(...domain);
		return [min, max];
	}

	setScales(): void {

	}

	update(): void {
		super.update();

		this.zone.run(() => {
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
				legendType: this.chart.schemeType
			});

			formatDates(this.data);

			this.groupDomain = this.getGroupDomain();
			this.innerDomain = this.getInnerDomain();
			this.valueDomain = this.getValueDomain();

			this.setScales();

			this.setColors();
			this.legendOptions = this.getLegendOptions();

			this.transform = `translate(${ this.viewDim.xOffset } , ${ this.margin[0] })`;
		});
	}

	onClick(data, group) {
		if (group) {
			data.series = group.name;
		}
		this.select.emit(data);
	}

	trackBy(index, item): string {
		return item.id || item.name;
	}

	setColors(): void {
		let domain;
		if (this.chart.schemeType === 'ordinal') {
			domain = this.innerDomain;
		} else {
			domain = this.valueDomain;
		}
		this.colors = new ColorHelper(this.chart.colorScheme, this.chart.schemeType, domain, this.chart.customColors);
	}

	getLegendOptions(): ILegendOptions {
		let opts = {
			scaleType: this.chart.schemeType,
			colors: undefined,
			domain: []
		};
		if (opts.scaleType === 'ordinal') {
			opts.domain = this.innerDomain;
			opts.colors = this.colors;
		} else {
			opts.domain = this.valueDomain;
			opts.colors = this.colors.scale;
		}

		return opts;
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
