import {Component, SimpleChanges, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import d3 from '../../d3';
import {formatLabel} from '../../utils/label.helper';
import {ColorHelper} from '../../utils/color.helper';
import {IChartData} from '../../chart.interface';
import {getTooltipLabeledText} from '../tooltip/tooltip.helper';


interface PieArc {
	data: IChartData;
	color: string;
	value: number;
	index: number;
	startAngle: number;
	endAngle: number;
	padAngle: number;
	pos: Array<number>;
}

@Component({
	selector: 'g[ngx-charts-pie-series]',
	template: `
    <svg:g *ngFor="let arc of arcs; trackBy:trackBy">
      <svg:g ngx-charts-pie-label
        *ngIf="labelVisible(arc)"
        [data]="arc"
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
	@Input() series: any = [];
	@Input() dims;
	@Input() innerRadius = 60;
	@Input() outerRadius = 80;
	@Input() explodeSlices;
	@Input() showLabels;
	@Input() gradient: boolean;
	@Input() activeEntries: any[];

	@Output() select = new EventEmitter();
	@Output() activate = new EventEmitter();
	@Output() deactivate = new EventEmitter();

	max: number;
	arcs: Array<PieArc>;

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
	}

	update(): void {
		let pie = d3.pie<{value: number}>()
			.value((d) => d.value)
			.sort(null);

		const arcData = pie(this.series).map(d => {
			// TODO: proper extend PieArcDataum
			return <any>d;
		});

		this.max = d3.max(arcData, (d) => {
			return d.value;
		});

		const minDistance = 11;
		arcData.forEach((d, index) => {
			d.pos = this.outerArc().centroid(d);
			d.pos[0] = this.outerRadius * (this.midAngle(d) < Math.PI ? 1 : -1);
			d.color = this.colors.getColor(index);
			d.label = formatLabel(d.data.name);
		});

		for (let i = 0; i < arcData.length - 1; i++) {
			let a = arcData[i];
			for (let j = i + 1; j < arcData.length; j++) {
				let b = arcData[j];
				// if they're on the same side
				if (b.pos[0] * a.pos[0] > 0) {
					// if they're overlapping
					if (Math.abs(b.pos[1] - a.pos[1]) <= minDistance) {
						// push the second one down
						arcData[j].pos[1] = b.pos[1] + minDistance;
						j--;
					}
				}
			}
		}
		this.arcs = arcData;
	}

	midAngle(d): number {
		return d.startAngle + (d.endAngle - d.startAngle) / 2;
	}

	outerArc(): any {
		const factor = 1.5;

		return d3.arc()
			.innerRadius(this.outerRadius * factor)
			.outerRadius(this.outerRadius * factor);
	}

	labelVisible(arc): boolean {
		return this.showLabels && (arc.endAngle - arc.startAngle > Math.PI / 30);
	}

	tooltipText(arc) {
		return getTooltipLabeledText(arc.label, formatLabel(arc.data.value));
	}

	trackBy(index, item): string {
		return item.data.name;
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
