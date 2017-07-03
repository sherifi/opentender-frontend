import {Component, Input, OnChanges, ViewContainerRef, ChangeDetectionStrategy, EventEmitter, Output, SimpleChanges} from '@angular/core';
// import {animate, style, transition, trigger} from '@angular/animations';
import {InjectionService} from '../services/injection.service';
import {IChartDimension, IChartBaseSettings, IChartData} from '../../chart.interface';
import {ILegendOptions} from '../common.interface';

@Component({
	providers: [InjectionService],
	selector: 'ngx-charts-chart',
	template: `<div [style.width.px]="dim.width">
	<svg class="ngx-charts" [attr.width]="chartWidth" [attr.height]="dim.height">
		<ng-content></ng-content>
	</svg>
	<ngx-charts-scale-legend
			*ngIf="chart.legend && chart.legend.show && legendType === 'scaleLegend'"
			class="chart-legend"
			[valueRange]="legendOptions.domain"
			[colors]="legendOptions.colors"
			[height]="dim.height"
			[width]="legendWidth">
	</ngx-charts-scale-legend>
	<ngx-charts-legend
			*ngIf="chart.legend && chart.legend.show && legendType === 'legend'"
			class="chart-legend"
			[data]="legendOptions.domain"
			[title]="chart.legend.title"
			[colors]="legendOptions.colors"
			[height]="dim.height"
			[width]="legendWidth"
			[activeEntries]="activeEntries"
			(labelClick)="legendLabelClick.emit($event)"
			(labelActivate)="legendLabelActivate.emit($event)"
			(labelDeactivate)="legendLabelDeactivate.emit($event)">
	</ngx-charts-legend>
</div>
  `,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// animations: [
	// 	trigger('animationState', [
	// 		transition('void => *', [
	// 			style({opacity: 0}),
	// 			animate('500ms 100ms', style({opacity: 1}))
	// 		])
	// 	])
	// ]
})
export class ChartComponent implements OnChanges {
	@Input() dim: IChartDimension;
	@Input() data: Array<IChartData>;
	@Input() chart: IChartBaseSettings;
	@Input() legendOptions: ILegendOptions;
	@Input() activeEntries: any[];
		@Output() legendLabelClick: EventEmitter<any> = new EventEmitter();
		@Output() legendLabelActivate: EventEmitter<any> = new EventEmitter();
	@Output() legendLabelDeactivate: EventEmitter<any> = new EventEmitter();

	chartWidth: number;
	legendWidth: number;
	legendType: string;

	constructor(private vcr: ViewContainerRef, private injectionService: InjectionService) {
		this.injectionService.setRootViewContainer(vcr);
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
	}

	update(): void {
		let legendColumns = 0;
		if (this.chart && this.chart.legend && this.chart.legend.show) {
			this.legendType = this.getLegendType();
			if (this.legendType === 'scaleLegend') {
				legendColumns = 1;
			} else {
				legendColumns = 2;
			}
		}
		let chartColumns = 12 - legendColumns;
		this.chartWidth = this.dim.width * chartColumns / 12.0;
		this.legendWidth = this.dim.width * legendColumns / 12.0;
	}

	getLegendType(): string {
		return (this.legendOptions.scaleType === 'linear') ? 'scaleLegend' : 'legend';
	}

}
