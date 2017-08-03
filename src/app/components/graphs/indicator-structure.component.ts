import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IChartPie} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {IStatsIndicators} from '../../app.interfaces';
import {Utils} from '../../model/utils';
import {Consts} from '../../model/consts';

@Component({
	selector: 'graph[indicator-structure]',
	template: `
		<div class="graph-title">Structure of {{indicator}}</div>
		<ngx-charts-pie-chart
				class="chart-container"
				[chart]="graph.chart"
				[data]="graph.data"
				(legendLabelClick)="graph.onLegendLabelClick($event)"
				(select)="graph.select($event)">
		</ngx-charts-pie-chart>
	`
})
export class GraphIndicatorStructureComponent implements OnChanges {
	@Input()
	data: IStatsIndicators;
	@Input()
	indicator: string = 'Indicators';

	indicators: IChartPie =  {
		chart: {
			schemeType: 'ordinal',
			view: {
				def: {width: 500, height: 320},
				min: {height: 320},
				max: {height: 320}
			},
			labels: true,
			explodeSlices: false,
			doughnut: false,
			gradient: false,
			valueFormatting: Utils.formatPercent,
			colorScheme: {
				domain: Consts.colors.diverging
			}
		},
		select: (event) => {
		},
		onLegendLabelClick: (event) => {
		},
		data: null
	};
	graph: IChartPie =  this.indicators;

	constructor() {
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.indicators.data = null;
		if (this.data) {
			this.indicators.data = Object.keys(this.data).map(key => {
				return {name: Utils.expandUnderlined(key.split('_').slice(1).join('_')), value: this.data[key]};
			});
		}
	}

}
