import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IChartBar} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {ISeriesProvider, IStatsLotsInYears} from '../../app.interfaces';
import {Utils} from '../../model/utils';
import {Consts} from '../../model/consts';
import {I18NService} from '../../services/i18n.service';

@Component({
	selector: 'graph[home-histogram]',
	template: `
		<div class="graph-title" i18n>Contracts (Lots) per Year</div>
		<ngx-charts-bar-vertical
				class="chart-container"
				[chart]="graph.chart"
				[data]="graph.data"
				(select)="graph.select($event)"
				(legendLabelClick)="graph.onLegendLabelClick($event)">
		</ngx-charts-bar-vertical>
		<select-series-download-button [sender]="this"></select-series-download-button>`
})
export class GraphHomeHistogramComponent implements OnChanges, ISeriesProvider {
	@Input()
	data: IStatsLotsInYears;

	lots_in_years: IChartBar = {
		chart: {
			schemeType: 'ordinal',
			view: {
				def: {width: 1024, height: 320},
				min: {height: 320},
				max: {height: 320}
			},
			xAxis: {
				show: true,
				showLabel: true,
				defaultHeight: 20,
				tickFormatting: Utils.formatYear
			},
			yAxis: {
				show: true,
				showLabel: true,
				defaultWidth: 44,
				minInterval: 1,
				tickFormatting: Utils.formatValue
			},
			showGridLines: true,
			gradient: false,
			colorScheme: {
				domain: Consts.colors.single
			}
		},
		select: (event) => {
		},
		onLegendLabelClick: (event) => {
		},
		data: null
	};

	graph: IChartBar = this.lots_in_years;

	constructor(private i18n: I18NService) {
		this.lots_in_years.chart.xAxis.label = this.i18n.get('Year');
		this.lots_in_years.chart.yAxis.label = this.i18n.get('Nr. of Contracts (Lots)');
	}

	getSeriesInfo() {
		return {data: this.graph.data, header: {value: this.graph.chart.yAxis.label, name: 'Year'}, filename: 'histogram'};
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.lots_in_years.data = null;
		if (this.data) {
			this.lots_in_years.data = Object.keys(this.data).map((key) => {
				return {name: key, value: this.data[key]};
			});
		}
	}

}
