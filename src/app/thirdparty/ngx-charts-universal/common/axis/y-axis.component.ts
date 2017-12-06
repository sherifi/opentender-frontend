import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnChanges,
	ViewChild,
	SimpleChanges,
	ChangeDetectionStrategy
} from '@angular/core';
import {YAxisTicksComponent} from './y-axis-ticks.component';

@Component({
	selector: 'g[ngx-charts-y-axis]',
	template: `
		<svg:g
				[attr.class]="yAxisClassName"
				[attr.transform]="transform">
			<svg:g ngx-charts-y-axis-ticks
				   [tickFormatting]="tickFormatting"
				   [tickArguments]="tickArguments"
				   [tickStroke]="tickStroke"
				   [scale]="yScale"
				   [orient]="yOrient"
				   [showGridLines]="showGridLines"
				   [gridLineWidth]="width"
				   [height]="dims.height"
				   [defaultWidth]="defaultWidth"
				   [trimLabelLength]="trimLabelLength"
				   [minInterval]="minInterval"
				   (dimensionsChanged)="emitTicksWidth($event)"
			/>
			<svg:g ngx-charts-axis-label
				   *ngIf="showLabel"
				   [label]="labelText"
				   [offset]="labelOffset"
				   [orient]="yOrient"
				   [height]="dims.height"
				   [width]="width">
			</svg:g>
		</svg:g>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class YAxisComponent implements OnChanges {

	@Input() yScale;
	@Input() dims;
	@Input() defaultWidth: number;
	@Input() tickFormatting;
	@Input() showGridLines = false;
	@Input() autoSize = false;
	@Input() showLabel;
	@Input() labelText;
	@Input() minInterval: number;
	@Input() trimLabelLength: number;

	@Output() dimensionsChanged = new EventEmitter();

	yAxisClassName: string = 'y axis';
	yAxisTickCount: any;
	tickArguments: any;
	offset: any;
	transform: any;
	width: number = 0;
	yAxisOffset: number = -5;
	yOrient: string = 'left';
	labelOffset: number = 0;
	fill: string = 'none';
	stroke: string = '#CCC';
	tickStroke: string = '#CCC';

	@ViewChild(YAxisTicksComponent) ticksComponent: YAxisTicksComponent;

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
	}

	update(): void {
		this.width = this.dims.width;
		if (this.width === 0) {
			this.width = this.defaultWidth;
			this.labelOffset = this.defaultWidth;
			this.dimensionsChanged.emit({width: this.width});
		}
		if (this.labelOffset === 0) {
			this.labelOffset = this.defaultWidth;
		}
		this.offset = this.yAxisOffset;
		if (this.yOrient === 'right') {
			this.transform = `translate(${this.offset + this.dims.width} , 0)`;
		} else {
			this.transform = `translate(${this.offset} , 0)`;
		}

		if (this.yAxisTickCount !== undefined) {
			this.tickArguments = [this.yAxisTickCount];
		}
	}

	emitTicksWidth({width}): void {
		if (this.autoSize && width !== this.labelOffset) {
			setTimeout(() => {
				this.dimensionsChanged.emit({width});
			});
		}
		this.labelOffset = width;
	}

}
