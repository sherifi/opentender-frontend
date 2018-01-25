import {Component, Input, OnChanges, ViewContainerRef, ChangeDetectionStrategy, EventEmitter, Output, SimpleChanges, ViewEncapsulation} from '@angular/core';
// import {animate, style, transition, trigger} from '@angular/animations';
import {InjectionService} from '../tooltip/injection.service';
import {IChartDimension, IChartBaseSettings, IChartData, IColorScaleType} from '../../chart.interface';
import {ILegendOptions} from '../common.interface';

@Component({
	providers: [InjectionService],
	selector: 'ngx-charts-chart',
	template: `
		<div [style.width.px]="dim.width">
			<svg class="ngx-charts" [ngClass]="{'chart-click': clickable}" [attr.width]="chartWidth" [attr.height]="dim.height">
				<ng-content></ng-content>
				<g *ngIf="label.text.length>0">
					<text stroke-width="0.01" fill-opacity="0.7" text-anchor="middle" [attr.x]="label.x" [attr.y]="label.y">{{label.text}}</text>
				</g>
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
	styleUrls: ['chart.component.scss'],
	encapsulation: ViewEncapsulation.None
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
	@Input() clickable: boolean = false;
	@Output() legendLabelClick: EventEmitter<any> = new EventEmitter();
	@Output() legendLabelActivate: EventEmitter<any> = new EventEmitter();
	@Output() legendLabelDeactivate: EventEmitter<any> = new EventEmitter();

	chartWidth: number;
	legendWidth: number;
	legendType: string;
	label = {
		x: 0,
		y: 0,
		text: ''
	};

	constructor(private vcr: ViewContainerRef, private injectionService: InjectionService) {
		this.injectionService.setRootViewContainer(vcr);
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
		// this.clickable = this.chart && this.chart.
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
		this.label.x = this.dim.width / 2;
		this.label.y = this.dim.height / 2;
		this.label.text = (!this.data) ? (this.chart.i18n ? this.chart.i18n.loading : 'LOADING') : (this.data.length == 0 ? (this.chart.i18n ? this.chart.i18n.no_data : 'NO DATA') : '');
	}

	getLegendType(): string {
		return (this.legendOptions.colors.scaleType === IColorScaleType.Linear) ? 'scaleLegend' : 'legend';
	}

}
