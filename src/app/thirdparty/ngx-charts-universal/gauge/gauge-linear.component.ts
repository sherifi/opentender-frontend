import {Component, Input, ElementRef, ViewChild, AfterViewInit, ChangeDetectionStrategy, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {BaseChartComponent} from '../common/chart/base-chart.component';
import {calculateViewDimensions, ViewDimensions} from '../utils/view-dimensions.helper';
import {ColorHelper} from '../utils/color.helper';
import {IChartGaugeSettings, IChartData} from '../chart.interface';
import {scaleLinear} from 'd3-scale';

@Component({
	selector: 'ngx-charts-linear-gauge',
	template: `
		<ngx-charts-chart
				[dim]="dim" [chart]="chart" [data]="data"
				[clickable]="clickable"
				(click)="onClick()">
			<svg:g class="linear-gauge chart">
				<svg:g ngx-charts-bar
					   class="background-bar"
					   [width]="viewDim.width"
					   [height]="3"
					   [x]="margin[3]"
					   [y]="viewDim.height / 2 + margin[0] - 2"
					   [data]="{}"
					   [orientation]="'horizontal'"
					   [roundEdges]="true">
				</svg:g>
				<svg:g ngx-charts-bar
					   [width]="valueScale(value)"
					   [height]="3"
					   [x]="margin[3]"
					   [y]="viewDim.height / 2 + margin[0] - 2"
					   [fill]="colors.getColor(value)"
					   [data]="{}" [orientation]="'horizontal'" [roundEdges]="true">
				</svg:g>
				<svg:line *ngIf="hasPreviousValue" [attr.transform]="transformLine" x1="0" y1="5" x2="0" y2="15" [attr.stroke]="colors.getColor(value)"/>
				<svg:line *ngIf="hasPreviousValue" [attr.transform]="transformLine" x1="0" y1="-5" x2="0" y2="-15" [attr.stroke]="colors.getColor(value)"/>
				<svg:g [attr.transform]="transform">
					<svg:g [attr.transform]="valueTranslate">
						<svg:text #valueTextEl
								  class="value"
								  [style.text-anchor]="'middle'"
								  [attr.transform]="valueTextTransform"
								  alignment-baseline="after-edge">
							{{displayValue}}
						</svg:text>
					</svg:g>

					<svg:g [attr.transform]="unitsTranslate">
						<svg:text #unitsTextEl
								  class="units"
								  [style.text-anchor]="'middle'"
								  [attr.transform]="unitsTextTransform"
								  alignment-baseline="before-edge">
							{{chart.units}}
						</svg:text>
					</svg:g>
				</svg:g>
			</svg:g>
		</ngx-charts-chart>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['gauge-linear.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class LinearGaugeComponent extends BaseChartComponent implements AfterViewInit {
	@Input() data: Array<IChartData>;
	@Input() chart: IChartGaugeSettings;
	@Output() select: EventEmitter<any>;

	@ViewChild('valueTextEl') valueTextEl: ElementRef;
	@ViewChild('unitsTextEl') unitsTextEl: ElementRef;

	viewDim: ViewDimensions;
	valueDomain: Array<number>;
	valueScale: (value: any) => any;
	value = 0;

	colors: ColorHelper;
	transform: string;
	margin = [10, 20, 10, 20];
	transformLine: string;

	valueResizeScale = 1;
	unitsResizeScale = 1;
	valueTextTransform = '';
	valueTranslate = '';
	unitsTextTransform = '';
	unitsTranslate = '';
	displayValue: string;
	hasPreviousValue: boolean;
	min = 0;
	max = 100;

	ngAfterViewInit(): void {
		super.ngAfterViewInit();
		setTimeout(() => {
			this.scaleText('value');
			this.scaleText('units');
		});
	}

	update(): void {
		this.hasPreviousValue = this.chart.previousValue !== undefined;
		this.max = Math.max(this.chart.max, this.value);
		this.min = Math.min(this.chart.min, this.value);
		this.value = this.data.length > 0 ? this.data[0].value : 0;
		if (this.hasPreviousValue) {
			this.max = Math.max(this.max, this.chart.previousValue);
			this.min = Math.min(this.min, this.chart.previousValue);
		}

		super.update();

		this.zone.run(() => {


			this.viewDim = calculateViewDimensions({
				width: this.dim.width,
				height: this.dim.height,
				margins: this.margin
			});

			this.valueDomain = this.getValueDomain();
			this.valueScale = this.getValueScale();
			this.displayValue = this.getDisplayValue();

			this.setColors();

			let xOffset = this.margin[3] + this.viewDim.width / 2;
			let yOffset = this.margin[0] + this.viewDim.height / 2;

			this.transform = `translate(${ xOffset }, ${ yOffset })`;
			this.transformLine = `translate(${ this.margin[3] + this.valueScale(this.chart.previousValue) }, ${ yOffset })`;
			this.valueTranslate = `translate(0, -15)`;
			this.unitsTranslate = `translate(0, 15)`;
			this.scaleText('value');
			this.scaleText('units');
		});
	}

	getValueDomain(): Array<number> {
		return [this.min, this.max];
	}

	getValueScale(): any {
		return scaleLinear()
			.range([0, this.viewDim.width])
			.domain(this.valueDomain);
	}

	getDisplayValue(): string {
		return this.value.toLocaleString();
	}

	scaleText(element): void {
		let el;
		let resizeScale;
		if (element === 'value') {
			el = this.valueTextEl;
			resizeScale = this.valueResizeScale;
		} else {
			el = this.unitsTextEl;
			resizeScale = this.unitsResizeScale;
		}

		const {width, height} = el.nativeElement.getBoundingClientRect();
		if (width === 0 || height === 0) {
			return;
		}
		const oldScale = resizeScale;
		const availableWidth = this.viewDim.width;
		const availableHeight = Math.max(this.viewDim.height / 2 - 15, 0);
		let resizeScaleWidth = Math.floor((availableWidth / (width / resizeScale)) * 100) / 100;
		let resizeScaleHeight = Math.floor((availableHeight / (height / resizeScale)) * 100) / 100;
		resizeScale = Math.min(resizeScaleHeight, resizeScaleWidth);

		if (resizeScale !== oldScale) {
			if (element === 'value') {
				this.valueResizeScale = resizeScale;
				this.valueTextTransform = `scale(${ resizeScale }, ${ resizeScale })`;
			} else {
				this.unitsResizeScale = resizeScale;
				this.unitsTextTransform = `scale(${ resizeScale }, ${ resizeScale })`;
			}

			this.cd.markForCheck();
			setTimeout(() => {
				this.scaleText(element);
			});
		}
	}

	onClick(): void {
		this.select.emit({
			name: 'Value',
			value: this.value
		});
	}

	setColors(): void {
		this.colors = ColorHelper.fromColorSet(this.chart.colorScheme, [this.value]);
	}
}
