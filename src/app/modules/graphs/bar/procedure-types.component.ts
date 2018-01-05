import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Utils} from '../../../model/utils';
import {IChartBar} from '../../../thirdparty/ngx-charts-universal/chart.interface';
import {ISeriesProvider, IStatsProcedureType} from '../../../app.interfaces';
import {I18NService} from '../../i18n/services/i18n.service';
import {Colors} from '../../../model/colors';

@Component({
	selector: 'graph[procedure-types]',
	template: `
		<div class="graph-title">{{title}}</div>
		<div class="graph-toolbar-container"></div>
		<ngx-charts-bar-horizontal-labeled
				class="chart-container"
				[chart]="graph.chart"
				[data]="graph.data"
				(select)="graph.select($event)"
				(legendLabelClick)="graph.onLegendLabelClick($event)">
		</ngx-charts-bar-horizontal-labeled>
		<series-download-button [sender]="this"></series-download-button>`
})
export class GraphProcedureTypesComponent implements OnChanges, ISeriesProvider {
	@Input()
	data: IStatsProcedureType;
	@Input()
	title: string = '';

	procedure_types_absolute: IChartBar = {
		chart: {
			view: {
				def: {width: 500, height: 360},
				min: {height: 360},
				max: {height: 360}
			},
			xAxis: {
				show: true,
				showLabel: true,
				minInterval: 1,
				defaultHeight: 20,
				tickFormatting: Utils.formatTrunc
			},
			yAxis: {
				show: false,
				showLabel: true,
				defaultWidth: 150,
				maxLength: 24,
			},
			valueFormatting: Utils.formatValue,
			showGridLines: true,
			gradient: false,
			colorScheme: Colors.colorSchemes.ordinal_2
		},
		select: (event) => {
		},
		onLegendLabelClick: (event) => {
		},
		data: null
	};

	graph: IChartBar = this.procedure_types_absolute;

	constructor(private i18n: I18NService) {
		this.procedure_types_absolute.chart.xAxis.label = this.i18n.get('Nr. of Tenders');
		this.procedure_types_absolute.chart.yAxis.label = this.i18n.get('Procedure Type');
	}

	getSeriesInfo() {
		return {data: this.graph.data, header: {value: this.graph.chart.xAxis.label, name: 'Procedure Type'}, filename: 'procedure_types'};
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.procedure_types_absolute.data = [];
		if (this.data) {
			this.procedure_types_absolute.data = Object.keys(this.data).map((key) => {
				return {id: key, name: Utils.expandUnderlined(key), value: this.data[key]};
			});
			this.procedure_types_absolute.data.sort((a, b) => {
				if (a.value > b.value) {
					return 1;
				}
				if (a.value < b.value) {
					return -1;
				}
				return 0;
			});
		}
	}

}
