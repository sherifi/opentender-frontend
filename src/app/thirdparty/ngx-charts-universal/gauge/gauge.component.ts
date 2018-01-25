import {Component, Input, ElementRef, ViewChild, AfterViewInit, ChangeDetectionStrategy, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {BaseChartComponent} from '../common/chart/base-chart.component';
import {calculateViewDimensions, ViewDimensions} from '../utils/view-dimensions.helper';
import {IChartGaugeSettings, IChartData, IScale} from '../chart.interface';
import {ColorHelper} from '../utils/color.helper';
import {scaleLinear} from 'd3-scale';
import {IDomain} from '../common/common.interface';

@Component({
	selector: 'ngx-charts-gauge',
	template: `
		<ngx-charts-chart [dim]="dim" [chart]="chart" [clickable]="clickable">
			<svg:g [attr.transform]="transform" class="gauge chart">
				<svg:g *ngFor="let arc of arcs" [attr.transform]="rotation">
					<svg:g ngx-charts-gauge-arc
						   [backgroundArc]="arc.backgroundArc"
						   [valueArc]="arc.valueArc"
						   [cornerRadius]="cornerRadius"
						   [colors]="colors"
						   (select)="onClick($event)">
					</svg:g>
				</svg:g>
				<svg:g ngx-charts-gauge-axis
					   *ngIf="chart.showAxis"
					   [bigSegments]="chart.bigSegments || 10"
					   [smallSegments]="chart.smallSegments || 5"
					   [min]="min"
					   [max]="max"
					   [radius]="outerRadius"
					   [angleSpan]="angleSpan"
					   [valueScale]="valueScale"
					   [startAngle]="startAngle">
				</svg:g>
				<svg:text #textEl
						  [style.text-anchor]="'middle'"
						  [attr.transform]="textTransform"
						  alignment-baseline="central">
					<tspan x="0" dy="0">{{displayValue}}</tspan>
					<tspan x="0" dy="1.2em">{{chart.units}}</tspan>
				</svg:text>

			</svg:g>
		</ngx-charts-chart>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['gauge.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class GaugeComponent extends BaseChartComponent implements AfterViewInit {
	@Input() data: Array<IChartData>;
	@Input() chart: IChartGaugeSettings;
	@Output() select: EventEmitter<any>;

	@ViewChild('textEl') textEl: ElementRef;

	viewDim: ViewDimensions;
	domain: any[];
	valueDomain: any;
	valueScale: any;

	colors: ColorHelper;
	transform: string;
	margin: any[];

	outerRadius: number;
	textRadius: number; // max available radius for the text
	resizeScale: number = 1;
	rotation: string = '';
	textTransform: string = '';
	cornerRadius: number = 10;
	arcs: any[];
	displayValue: string;
	min: number;
	max: number;
	angleSpan: number;
	startAngle: number;

	ngAfterViewInit(): void {
		super.ngAfterViewInit();
		setTimeout(() => this.scaleText());
	}

	update(): void {
		this.startAngle = this.chart.startAngle;
		this.angleSpan = this.chart.angleSpan;
		if (this.startAngle === undefined) {
			this.startAngle = -120;
		}
		if (this.angleSpan === undefined) {
			this.angleSpan = 240;
		}
		// make the starting angle positive
		if (this.startAngle < 0) {
			this.startAngle = (this.startAngle % 360) + 360;
		}
		let values = this.data.map(d => d.value);
		let dataMin = Math.min(...values);
		let dataMax = Math.max(...values);
		let min;
		if (this.chart.min !== undefined) {
			min = Math.min(this.chart.min, dataMin);
		} else {
			min = dataMin;
		}
		let max;
		if (this.chart.max !== undefined) {
			max = Math.max(this.chart.max, dataMax);
		} else {
			max = dataMax;
		}
		this.min = min;
		this.max = max;

		super.update();

		this.zone.run(() => {
			if (!this.chart.showAxis) {
				this.margin = [10, 20, 10, 20];
			} else {
				this.margin = [60, 100, 60, 100];
			}

			this.viewDim = calculateViewDimensions({
				width: this.dim.width,
				height: this.dim.height,
				margins: this.margin
			});

			this.domain = this.getDomain();
			this.valueDomain = this.getValueDomain();
			this.valueScale = this.getValueScale();
			this.displayValue = this.getDisplayValue();

			this.outerRadius = Math.min(this.viewDim.width, this.viewDim.height) / 2;

			this.arcs = this.getArcs();

			this.setColors();

			let xOffset = this.margin[3] + this.viewDim.width / 2;
			let yOffset = this.margin[0] + this.viewDim.height / 2;

			this.transform = `translate(${ xOffset }, ${ yOffset })`;
			this.rotation = `rotate(${ this.startAngle })`;
			this.scaleText();
		});
	}

	getArcs(): any[] {
		let arcs = [];

		let availableRadius = this.outerRadius * 0.7;

		let radiusPerArc = Math.min(availableRadius / this.data.length, 10);
		let arcWidth = radiusPerArc * 0.7;
		this.textRadius = this.outerRadius - this.data.length * radiusPerArc;
		this.cornerRadius = Math.floor(arcWidth / 2);

		let i = 0;
		for (let d of this.data) {
			let outerRadius = this.outerRadius - (i * radiusPerArc);
			let innerRadius = outerRadius - arcWidth;

			let backgroundArc = {
				endAngle: this.angleSpan * Math.PI / 180,
				innerRadius: innerRadius,
				outerRadius: outerRadius,
				data: {
					value: this.max,
					name: d.name
				}
			};

			let valueArc = {
				endAngle: Math.min(this.valueScale(d.value), this.angleSpan) * Math.PI / 180,
				innerRadius: innerRadius,
				outerRadius: outerRadius,
				data: {
					value: d.value,
					name: d.name
				}
			};

			let arc = {
				backgroundArc,
				valueArc
			};

			arcs.push(arc);
			i++;
		}

		return arcs;
	}

	getDomain(): IDomain {
		return this.data.map(d => d.name);
	}

	getValueDomain(): IDomain {
		return [this.min, this.max];
	}

	getValueScale(): IScale {
		return scaleLinear()
			.range([0, this.angleSpan])
			.domain(this.valueDomain);
	}

	getDisplayValue(): string {
		let value = this.data.map(d => d.value).reduce((a, b) => {
			return a + b;
		}, 0);
		return value.toLocaleString();
	}

	scaleText(): void {
		const {width} = this.textEl.nativeElement.getBoundingClientRect();
		if (width === 0) {
			return;
		}

		const oldScale = this.resizeScale;
		const availableSpace = this.textRadius;
		this.resizeScale = Math.floor((availableSpace / (width / this.resizeScale)) * 100) / 100;

		if (this.resizeScale !== oldScale) {
			this.textTransform = `scale(${this.resizeScale}, ${this.resizeScale})`;
			this.cd.markForCheck();
			setTimeout(() => {
				this.scaleText();
			});
		}
	}

	onClick(data): void {
		this.select.emit(data);
	}

	setColors(): void {
		this.colors = ColorHelper.fromColorSet(this.chart.colorScheme, this.domain);
	}
}
