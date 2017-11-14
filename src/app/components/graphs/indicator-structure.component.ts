import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {IChartPie} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {ISeriesProvider, IStatsIndicators} from '../../app.interfaces';
import {Utils} from '../../model/utils';
import {Consts} from '../../model/consts';

@Component({
	selector: 'graph[indicator-structure]',
	template: `
		<div class="graph-title" i18n>Average Score of {{title}}</div>
		<div class="graph-toolbar-container"></div>
		<ngx-charts-radar-chart
				class="chart-container"
				[chart]="graph.chart"
				[data]="graph.data"
				(legendLabelClick)="graph.onLegendLabelClick($event)"
				(select)="graph.select($event)">
		</ngx-charts-radar-chart>
		<select-series-download-button [sender]="this"></select-series-download-button>`
})
export class GraphIndicatorStructureComponent implements OnChanges, ISeriesProvider {
	@Input()
	data: IStatsIndicators;
	@Input()
	title: string = '';
	@Output()
	onSelect = new EventEmitter();

	indicators: IChartPie = {
		chart: {
			schemeType: 'ordinal',
			view: {
				def: {width: 1024, height: 360},
				min: {height: 360},
				max: {height: 360}
			},
			labels: true,
			explodeSlices: false,
			doughnut: false,
			gradient: false,
			valueFormatting: Utils.formatValue,
			colorScheme: {
				domain: Consts.colors.diverging
			}
		},
		select: (event) => {
			this.onSelect.emit(event);
		},
		onLegendLabelClick: (event) => {
		},
		data: null
	};
	graph: IChartPie = this.indicators;

	constructor() {
	}

	getSeriesInfo() {
		return {data: this.graph.data, header: {value: 'Score', name: 'Name'}, filename: this.title + '-scores'};
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.indicators.data = null;
		if (this.data) {
			this.indicators.data = Object.keys(this.data).map(key => {
				return {info: Utils.getIndicator(key), value: this.data[key], id: key};
			}).sort((a, b) => {
				return (a.info ? a.info.order : -1) - (a.info ? b.info.order : -1);
			}).map(indicator => {
				return {name: indicator.info ? indicator.info.name : indicator.id, value: indicator.value, id: indicator.id};
			});
		}
	}

}
