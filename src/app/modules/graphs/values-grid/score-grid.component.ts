import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Utils} from '../../../model/utils';
import {IChartData, IChartPieSeries} from '../../../thirdparty/ngx-charts-universal/chart.interface';
import {ISeriesProvider} from '../../../app.interfaces';
import {Router} from '@angular/router';
import {I18NService} from '../../i18n/services/i18n.service';
import {Colors} from '../../../model/colors';

@Component({
	selector: 'graph[score-grid]',
	template: `<div class="graph-title">{{title}}</div><ngx-charts-values-grid class="chart-container" [chart]="graph.chart" [data]="graph.data"></ngx-charts-values-grid>`
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
			view: {
				def: {width: 762, height: 200},
				min: {height: 200},
				max: {height: 200}
			},
			labels: true,
			maxValue: 100,
			valueFormatting: (value: number) => {
				return this.i18n.formatValue(value);
			},
			colorScheme: Colors.colorSchemes.linear_red_green
		},
		data: null
	};

	graph: IChartPieSeries = this.scores;

	constructor(private router: Router, private i18n: I18NService) {
		this.scores.chart.i18n = this.i18n.ChartsTranslations;
	}

	getSeriesInfo() {
		return {data: this.data, header: {value: 'Score', name: 'Name'}, filename: 'indicators'};
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.data) {
			this.scores.data = null;
			if (this.data) {
				this.scores.data = this.data;
			}
		}
		this.graph.chart.labels = this.isIndicators;
		this.graph.chart.maxRadius = this.isIndicators ? 40 : null;
		this.graph.chart.view.def.width = this.isIndicators ? 762 : 238;
	}

}
