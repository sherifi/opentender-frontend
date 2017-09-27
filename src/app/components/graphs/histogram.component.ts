import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Utils} from '../../model/utils';
import {Consts} from '../../model/consts';
import {IChartBar} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {IStatsLotsInYears} from '../../app.interfaces';

@Component({
	selector: 'graph[histogram]',
	template: `
		<div class="title">Contracts (Lots) per Year</div>
		<ngx-charts-bar-vertical
				class="chart-container"
				[chart]="graph.chart"
				[data]="graph.data"
				(select)="graph.select($event)"
				(legendLabelClick)="graph.onLegendLabelClick($event)">
		</ngx-charts-bar-vertical>
		<div class="graph-footer">
			<div class="graph-toolbar-container">
				<div class="graph-toolbar">
					<button class="tool-button" (click)="this.download('csv')" title="Download data as CSV"><i class="icon-cloud-download"></i> CSV</button>
					<button class="tool-button" (click)="this.download('json')" title="Download data as JSON"><i class="icon-cloud-download"></i> JSON</button>
				</div>
			</div>
		</div>`
})
export class GraphHistogramComponent implements OnChanges {
	@Input()
	data: IStatsLotsInYears;

	lots_in_years: IChartBar = {
		chart: {
			schemeType: 'ordinal',
			view: {
				def: {width: 500, height: 360},
				min: {height: 360},
				max: {height: 360}
			},
			xAxis: {
				show: true,
				showLabel: true,
				label: 'Year',
				defaultHeight: 20,
				tickFormatting: Utils.formatYear
			},
			yAxis: {
				show: true,
				showLabel: true,
				label: 'Nr. of Contracts',
				defaultWidth: 30,
				minInterval: 1,
				tickFormatting: Utils.formatTrunc
			},
			valueFormatting: Utils.formatTrunc,
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

	constructor() {
	}

	download(format): void {
		Utils.downloadSeries(format, this.graph.data, {value: this.graph.chart.yAxis.label, name: 'Year'}, 'histogram');
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
