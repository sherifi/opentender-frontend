import {ChangeDetectorRef, ElementRef, EventEmitter, Input, NgZone, Output} from '@angular/core';
import {BaseChartComponent, PlatformService} from './base-chart.component';
import {calculateViewDimensions, ViewDimensions} from '../../utils/view-dimensions.helper';
import {IChartData, IChartXYAxisSettings} from '../../chart.interface';
import {ColorHelper} from '../../utils/color.helper';
import {IDomain, ILegendOptions} from '../common.interface';

export class BaseXYAxisComponent extends BaseChartComponent {
	@Input() chart: IChartXYAxisSettings;
	@Input() data: Array<IChartData>;
	@Input() activeEntries: any[];
	@Output() select: EventEmitter<any>;
	@Output() activate: EventEmitter<any>;
	@Output() deactivate: EventEmitter<any>;

	viewDim: ViewDimensions = {
		width: 0,
		height: 0,
		xOffset: 0,
	};
	margin: Array<number> = [10, 20, 10, 20];
	xAxisHeight = 0;
	yAxisWidth = 0;
	xScale;
	yScale;
	colors: ColorHelper;
	xDomain: IDomain;
	yDomain: IDomain;
	transform: string;
	legendOptions: ILegendOptions;

	constructor(protected chartElement: ElementRef, protected zone: NgZone, protected cd: ChangeDetectorRef, protected platform: PlatformService) {
		super(chartElement, zone, cd, platform);
	}

	getXScale() {
		return null; // "abstract"
	}

	getYScale() {
		return null; // "abstract"
	}

	getXDomain(): IDomain {
		return null; // "abstract"
	}

	getYDomain(): IDomain {
		return null; // "abstract"
	}

	getLegendOptions(): ILegendOptions {
		return null; // "abstract"
	}

	getColorDomain(): IDomain {
		return null; // "abstract"
	}

	updateDomains(): void {
	}

	updateScales(): void {
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

				this.xDomain = this.getXDomain();
				this.yDomain = this.getYDomain();
				this.updateDomains();

				this.xScale = this.getXScale();
				this.yScale = this.getYScale();
				this.updateScales();

				this.setColors();
				this.legendOptions = this.getLegendOptions();
			}

			this.transform = `translate(${ this.viewDim.xOffset } , ${ this.margin[0] })`;
		});
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

	setColors(): void {
		this.colors = ColorHelper.fromColorSet(this.chart.colorScheme, this.getColorDomain());
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
