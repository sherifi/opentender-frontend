import {Component, OnChanges, Input, Output, SimpleChanges, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {getTooltipLabeledText} from '../tooltip/tooltip.helper';
import {IChartDimension} from '../../chart.interface';
import {ColorHelper} from '../../utils/color.helper';

export interface ITreeMapData {
	id: string;
	valueId: string;
	depth: number;
	x0: number;
	x1: number;
	y0: number;
	y1: number;
	value: number;
	valueType: string;
	parent?: ITreeMapData;
	children?: Array<ITreeMapData>;
	data?: ITreeMapData;
}

@Component({
	selector: 'g[ngx-charts-tree-map-cell-series]',
	template: `
    <svg:g ngx-charts-tree-map-cell *ngFor="let c of cells; trackBy:trackBy"
      [x]="c.x"
      [y]="c.y"
      [width]="c.width"
      [height]="c.height"
      [fill]="c.fill"
      [valueId]="c.valueId"
      [label]="c.label"
      [value]="c.value"
      [valueType]="c.valueType"
      [formatCellNumber]="formatSeriesNumber"
      (select)="onClick($event)"
      ngx-tooltip
      [tooltipPlacement]="'top'"
      [tooltipType]="'tooltip'"
      [tooltipTitle]="getTooltipText(c)"
    />
  `,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeMapCellSeriesComponent implements OnChanges {

	@Input() node: ITreeMapData;
	@Input() dims: IChartDimension;
	@Input() formatSeriesNumber: (n: number) => string;
	@Input() colors: ColorHelper;

	@Output() select = new EventEmitter();

	cells: any[];


	ngOnChanges(changes: SimpleChanges): void {
		this.cells = this.getCells();
	}

	getCells(): any[] {
		if (!this.node || !this.dims || !this.node.children) {
			return [];
		}
		return this.node.children
			.filter((d) => {
				return d.depth === 1;
			})
			.map((d) => {
				return {
					x: d.x0,
					y: d.y0,
					width: d.x1 - d.x0,
					height: d.y1 - d.y0,
					fill: this.colors.getColor(d.data.valueId || d.id),
					label: d.id,
					value: d.value,
					valueType: d.valueType,
					valueId: d.data.valueId
				};
			});
	}

	getTooltipText({label, value}): string {
		return getTooltipLabeledText(label, this.formatSeriesNumber ? this.formatSeriesNumber(value) : value.toLocaleString());
	}

	onClick(data): void {
		this.select.emit(data);
	}

	trackBy(index, item): string {
		return item.label;
	}
}
