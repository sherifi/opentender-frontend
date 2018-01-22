import {Component, Input, SimpleChanges, Output, EventEmitter, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import {getTooltipLabeledText} from '../tooltip/tooltip.helper';
import {IChartData} from '../../chart.interface';
import {scaleLog} from 'd3-scale';
import {ColorHelper} from '../../utils/color.helper';

interface ICell {
	x: number;
	y: number;
	r: number;
	width: number;
	height: number;
	fill: string;
	stroke: string;
	data: number;
	label: string;
	series: string;
	source: IChartData;
}

@Component({
	selector: 'g[ngx-charts-heat-map-circle-cell-series]',
	template: `
		<svg:g
				ngx-charts-heat-map-circle-cell
				*ngFor="let c of cells; trackBy:trackBy"
				[x]="c.x"
				[y]="c.y"
				[r]="c.r"
				[width]="c.width"
				[height]="c.height"
				[fill]="c.fill"
				[stroke]="c.stroke"
				[data]="c.data"
				(select)="onClick($event, c)"
				ngx-tooltip
				[tooltipPlacement]="'top'"
				[tooltipType]="'tooltip'"
				[tooltipTitle]="getTooltipText(c)"
		/>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeatMapCircleCellSeriesComponent implements OnChanges {
	@Input() data;
	@Input() colors: ColorHelper;
	@Input() xScale;
	@Input() yScale;
	@Input() no_data: string;
	@Input() valueFormatting?: (val: number | Date | string) => string;

	@Output() select = new EventEmitter();

	cells: Array<ICell>;

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
	}

	update(): void {
		this.cells = this.getCells();
	}

	getCells(): Array<ICell> {
		if (!this.data) {
			return [];
		}
		let width = this.xScale.bandwidth();
		let height = this.yScale.bandwidth();
		let max = 0;
		this.data.forEach((row) => {
			row.series.forEach((cell) => {
				if (cell.value !== null) {
					max = Math.max(cell.value, max);
				}
			});
		});
		let radius = Math.min(height, width) / 2;
		let scale = scaleLog().base(5).domain([0.1, max]).range([0, radius]);
		let getRadius = (val) => {
			if ((val === null) || (val < 0.1)) {
				return 0;
			}
			return scale(val);
		};
		let cells: Array<ICell> = [];
		this.data.map((row) => {
			row.series.map((cell) => {
				cells.push({
					x: this.xScale(row.name) + (width / 2),
					y: this.yScale(cell.name) + (height / 2),
					r: getRadius(cell.value),
					width: width,
					height: height,
					fill: cell.color || this.colors.getColor(parseInt(row.name, 10)),
					stroke: '#aaaaaa',
					data: cell.value,
					label: cell.name,
					series: row.name,
					source: cell
				});
			});
		});
		return cells;
	}

	getTooltipText(cell: ICell): string {
		return getTooltipLabeledText(`${cell.series} • ${cell.label}`, cell.data === null ?
			(this.no_data ? this.no_data : 'NO DATA') :
			(this.valueFormatting ? this.valueFormatting(cell.data) : cell.data.toLocaleString()));
	}

	trackBy(index: number, item: ICell): string {
		return item.label;
	}

	onClick(item: ICell): void {
		this.select.emit(item.source);
	}

}
