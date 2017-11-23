import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Utils} from '../../model/utils';
import {Consts} from '../../model/consts';
import {IChartData, IChartPieSeries} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {ISeriesProvider} from '../../app.interfaces';
import {Router} from '@angular/router';
import {I18NService} from '../../services/i18n.service';

@Component({
	selector: 'graph[score-grid]',
	template: `
		<div class="graph-title">{{title}}</div>
		<!--<div class="graph-toolbar-container"></div>-->
		<ngx-charts-values-grid
				class="chart-container"
				[chart]="graph.chart"
				[data]="graph.data"
				(select)="graph.select($event)"
				(legendLabelClick)="graph.onLegendLabelClick($event)">
		</ngx-charts-values-grid>
		<!--<select-series-download-button [sender]="this"></select-series-download-button>-->`
})
export class GraphScoreGridComponent implements OnChanges, ISeriesProvider {
	@Input()
	data: Array<IChartData>;
	@Input()
	title: string = '';
	@Input()
	isIndicators: boolean = false;

	scores: IChartPieSeries = {
		chart: {
			schemeType: 'ordinal',
			view: {
				def: {width: 762, height: 200},
				min: {height: 200},
				max: {height: 200}
			},
			labels: true,
			maxValue: 100,
			valueFormatting: Utils.formatValue,
			colorScheme: {
				domain: Consts.colors.single2
			}
		},
		select: (event) => {
		},
		onLegendLabelClick: (event) => {
		},
		data: null
	};

	graph: IChartPieSeries = this.scores;

	constructor(private router: Router, private i18n: I18NService) {
	}

	getSeriesInfo() {
		return {data: this.data, header: {value: 'Score', name: 'Name'}, filename: 'indicators'};
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.scores.data = null;
		if (this.data) {
			this.scores.data = this.data;
		}
		this.graph.chart.labels = this.isIndicators;
		this.graph.chart.maxRadius = this.isIndicators ? 40 : null;
		this.graph.chart.view.def.width = this.isIndicators ? 762 : 238;
	}

}
