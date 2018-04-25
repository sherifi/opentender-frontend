import {Component, SimpleChanges, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import {formatLabel} from '../../utils/label.helper';
import {ColorHelper} from '../../utils/color.helper';
import {IChartData} from '../../chart.interface';
import {getTooltipLabeledText} from '../tooltip/tooltip.helper';
import {arc, pie} from 'd3-shape';
import {max} from 'd3-array';

interface PieArc {
	data: IChartData;
	color: string;
	value: number;
	index: number;
	startAngle: number;
	endAngle: number;
	padAngle: number;
	pos: Array<number>;
	isLeft: boolean;
	label: string;
}

@Component({
	selector: 'g[ngx-charts-pie-series]',
	template: `
		<svg:g *ngFor="let arc of arcs; trackBy:trackBy">
			<svg:g ngx-charts-pie-label
				   *ngIf="labelVisible(arc)"
				   [data]="arc"
				   [isLeft]="arc.isLeft"
				   [radius]="outerRadius"
				   [color]="arc.color"
				   [label]="arc.label"
				   [max]="max"
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
					[fill]="arc.color"
					[value]="arc.data.value"
					[gradient]="gradient"
					[data]="arc.data"
					[max]="max"
					[explodeSlices]="explodeSlices"
					[isActive]="isActive(arc.data)"
					(select)="onClick($event)"
					(activate)="activate.emit($event)"
					(deactivate)="deactivate.emit($event)"
					ngx-tooltip
					[tooltipPlacement]="'top'"
					[tooltipType]="'tooltip'"
					[tooltipTitle]="tooltipText(arc)">
			</svg:g>
		</svg:g>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieSeriesComponent implements OnChanges {

	@Input() colors: ColorHelper;
	@Input() series: any;
	@Input() dims;
	@Input() innerRadius = 60;
	@Input() outerRadius = 80;
	@Input() explodeSlices;
	@Input() showLabels;
	@Input() gradient: boolean;
	@Input() activeEntries: any[];
	@Input() valueFormatting: (value) => string;

	@Output() select = new EventEmitter();
	@Output() activate = new EventEmitter();
	@Output() deactivate = new EventEmitter();

	max: number;
	total: number;
	arcs: Array<PieArc>;

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
	}

	update(): void {
		if (!this.series) {
			return;
		}
		let p = pie<{ value: number }>()
			.value((d) => d.value)
			.sort(null);

		const arcData = p(this.series).map(d => {
			// TODO: proper extend PieArcDataum
			return <any>d;
		});

		this.total = 0;
		this.max = max(arcData, (d) => {
			this.total += d.value;
			return d.value;
		});

		arcData.forEach((d, index) => {
			d.isLeft = this.midAngle(d) < Math.PI;
			d.pos = this.outerArc().centroid(d);
			d.pos[0] = this.outerRadius * (d.isLeft ? 1 : -1);
			d.color = this.colors.getColor(index);
			d.label = formatLabel(d.data.name);
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
		let text = '';
		let percent = this.total > 0 ? a.data.value / (this.total / 100) : 0;
		if (this.valueFormatting) {
			text = this.valueFormatting(percent);
		} else {
			text = formatLabel(Math.round(percent * 100) / 100) + '%';
		}
		return getTooltipLabeledText(a.label, text);
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
