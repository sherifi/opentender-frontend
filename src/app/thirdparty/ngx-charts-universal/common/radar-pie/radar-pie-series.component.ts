import {Component, SimpleChanges, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import {formatLabel} from '../../utils/label.helper';
import {ColorHelper} from '../../utils/color.helper';
import {IChartData} from '../../chart.interface';
import {getTooltipLabeledText} from '../tooltip/tooltip.helper';
import {arc, pie} from 'd3-shape';

interface PieArc {
	data: IChartData;
	isLeft: boolean;
	color: string;
	label: string;
	value: number;
	index: number;
	startAngle: number;
	endAngle: number;
	padAngle: number;
	pos: Array<number>;
	outerRadius: number;
}

@Component({
	selector: 'g[ngx-charts-radar-pie-series]',
	template: `
		<svg:g *ngFor="let arc of arcs; trackBy:trackBy">
			<svg:g ngx-charts-pie-label
				   *ngIf="labelVisible(arc)"
				   [data]="arc"
				   [isLeft]="arc.isLeft"
				   [radius]="outerRadius"
				   [color]="arc.color"
				   [label]="arc.label"
				   [max]="maxValue"
				   [value]="arc.value"
				   [explodeSlices]="explodeSlices"
				   ngx-tooltip
				   [tooltipPlacement]="'top'"
				   [tooltipType]="'tooltip'"
				   [tooltipTitle]="tooltipText(arc)">
			</svg:g>
			<svg:g
					ngx-charts-pie-arc
					[startAngle]="arc.startAngle"
					[endAngle]="arc.endAngle"
					[innerRadius]="innerRadius"
					[outerRadius]="outerRadius"
					[border]="borderColor"
					[value]="arc.data.value"
					[gradient]="gradient"
					[data]="arc.data"
					[max]="maxValue"
					[explodeSlices]="explodeSlices"
					[isActive]="isActive(arc.data)"
					(select)="onClick($event)"
					(activate)="activate.emit($event)"
					(deactivate)="deactivate.emit($event)"
					ngx-tooltip
					[tooltipPlacement]="'top'"
					[tooltipType]="'tooltip'"
					[tooltipTitle]="tooltipText(arc)"></svg:g>
			<svg:g
					ngx-charts-pie-arc
					[startAngle]="arc.startAngle"
					[endAngle]="arc.endAngle"
					[innerRadius]="innerRadius"
					[outerRadius]="arc.outerRadius"
					[fill]="arc.color"
					[value]="arc.data.value"
					[gradient]="gradient"
					[data]="arc.data"
					[max]="maxValue"
					[explodeSlices]="explodeSlices"
					[isActive]="isActive(arc.data)"
					(select)="onClick($event)"
					(activate)="activate.emit($event)"
					(deactivate)="deactivate.emit($event)"
					ngx-tooltip
					[tooltipPlacement]="'top'"
					[tooltipType]="'tooltip'"
					[tooltipTitle]="tooltipText(arc)"></svg:g>
		</svg:g>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadarPieSeriesComponent implements OnChanges {

	@Input() colors: ColorHelper;
	@Input() series: Array<IChartData>;
	@Input() weights: Array<IChartData>;
	@Input() dims;
	@Input() innerRadius = 60;
	@Input() outerRadius = 80;
	@Input() maxValue = 100;
	@Input() explodeSlices;
	@Input() radar: boolean = true;
	@Input() showLabels;
	@Input() gradient: boolean;
	@Input() borderColor: string = '#969696';
	@Input() activeEntries: any[];
	@Input() valueFormatting: (value) => string;

	@Output() select = new EventEmitter();
	@Output() activate = new EventEmitter();
	@Output() deactivate = new EventEmitter();

	arcs: Array<PieArc>;

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
	}

	getWeight(d: IChartData) {
		if (!this.weights) {
			return 1;
		} else {
			let weight = this.weights.find(w => {
				return (w.id && d.id && w.id === d.id) || (w.name === d.name);
			});
			return weight ? weight.value : 0;
		}
	}

	update(): void {
		if (!this.series) {
			return;
		}
		let p = pie<IChartData>()
			.value((d) => this.radar ? this.getWeight(d) : d.value)
			.sort(null);

		const arcData = <Array<PieArc>>p(this.series);

		arcData.forEach((d, index) => {
			d.isLeft = this.midAngle(d) < Math.PI;
			d.pos = this.outerArc().centroid(d);
			d.pos[0] = this.outerRadius * (d.isLeft ? 1 : -1);
			d.color = this.colors.getColor(d.data.value);
			d.label = formatLabel(d.data.name);
			d.outerRadius = this.radar ? (this.outerRadius * d.data.value / this.maxValue) : this.outerRadius;
		});

		this.orderLabels(arcData);

		this.arcs = arcData;
	}

	orderLabelsSide(arcs) {
		arcs = arcs.sort((a, b) => {
			return a.pos[1] - b.pos[1];
		});
		const minDistance = 20;
		for (let i = 1; i < arcs.length; i++) {
			let a = arcs[i - 1];
			let b = arcs[i];
			// if they're overlapping
			if (b.pos[1] - a.pos[1] <= minDistance) {
				// push it down
				b.pos[1] = a.pos[1] + minDistance;
			}
		}
	}

	orderLabels(arcData) {
		this.orderLabelsSide(arcData.filter(a => a.isLeft));
		this.orderLabelsSide(arcData.filter(a => !a.isLeft));
	}


	midAngle(d): number {
		return d.startAngle + (d.endAngle - d.startAngle) / 2;
	}

	outerArc(): any {
		const factor = 1.5;
		return arc()
			.innerRadius(this.outerRadius * factor)
			.outerRadius(this.outerRadius * factor);
	}

	labelVisible(a): boolean {
		return this.showLabels && (a.endAngle - a.startAngle > Math.PI / 30);
	}

	tooltipText(a) {
		return getTooltipLabeledText(a.label, this.valueFormatting ? this.valueFormatting(a.data.value) : formatLabel(a.data.value));
	}

	trackBy(index, item): string {
		return item.data.id || item.data.name;
	}

	onClick(data): void {
		this.select.emit(data);
	}

	isActive(entry): boolean {
		if (!this.activeEntries) {
			return false;
		}
		let item = this.activeEntries.find(d => {
			return entry.name === d.name && entry.series === d.series;
		});
		return item !== undefined;
	}

}
