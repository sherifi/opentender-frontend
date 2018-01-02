import {Component, Input, SimpleChanges, Output, EventEmitter, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import {getTooltipLabeledText} from '../tooltip/tooltip.helper';
import {IChartData} from '../../chart.interface';
import {ColorHelper} from '../../utils/color.helper';

interface ICell {
	x: number;
	y: number;
	width: number;
	height: number;
	fill: string;
	data: number;
	label: string;
	series: string;
	source: IChartData;
}

@Component({
	selector: 'g[ngx-charts-heat-map-cell-series]',
	template: `
		<svg:g
				ngx-charts-heat-map-cell
				*ngFor="let c of cells; trackBy:trackBy"
				[x]="c.x"
				[y]="c.y"
				[width]="c.width"
				[height]="c.height"
				[fill]="c.fill"
				[data]="c.data"
				(select)="onClick($event, c)"
				[gradient]="gradient"
				ngx-tooltip
				[tooltipPlacement]="'top'"
				[tooltipType]="'tooltip'"
				[tooltipTitle]="getTooltipText(c)"
		/>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeatCellSeriesComponent implements OnChanges {
	@Input() data;
	@Input() colors: ColorHelper;
	@Input() xScale;
	@Input() yScale;
	@Input() gradient: boolean;

	@Output() select = new EventEmitter();

	cells: Array<ICell>;

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
	}

	update(): void {
		this.cells = this.getCells();
	}

	getCells(): Array<ICell> {
		let cells: Array<ICell> = [];
		this.data.map((row) => {
			row.series.map((cell) => {
				cells.push({
					x: this.xScale(row.name),
					y: this.yScale(cell.name),
					width: this.xScale.bandwidth(),
					height: this.yScale.bandwidth(),
					fill: this.colors.getColor(cell.value),
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
		return getTooltipLabeledText(`${cell.series} • ${cell.label}`, cell.data.toLocaleString());
	}

	trackBy(index: number, item: ICell): string {
		return item.label;
	}

	onClick(item: ICell): void {
		this.select.emit(item.source);
	}

}
