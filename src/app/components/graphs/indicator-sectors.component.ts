import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Utils} from '../../model/utils';
import {Consts} from '../../model/consts';
import {IChartBar} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {IStatsCpvs} from '../../app.interfaces';

@Component({
	selector: 'graph[indicator-sectors]',
	template: `
		<div class="title">Tenders with {{indicator}} per Sector</div>
		<div class="graph-toolbar">
			<button class="tool-button" [ngClass]="{down:this.graph==this.cpvs_codes_average}" (click)="this.graph=this.cpvs_codes_average">Average</button>
			<button class="tool-button" [ngClass]="{down:this.graph==this.cpvs_codes_absolute}" (click)="this.graph=this.cpvs_codes_absolute">Absolute</button>
		</div>
		<ngx-charts-bar-horizontal
				class="chart-container"
				[chart]="graph.chart"
				[data]="graph.data"
				(select)="graph.select($event)"
				(legendLabelClick)="graph.onLegendLabelClick($event)">
		</ngx-charts-bar-horizontal>`
})
export class GraphIndicatorSectorsComponent implements OnChanges {
	@Input()
	data: IStatsCpvs;
	@Input()
	indicator: string = 'Indicators';
	// @Output()
	// sortChange = new EventEmitter();

	cpvs_codes_average: IChartBar =  {
		visible: false,
		chart: {
			schemeType: 'ordinal',
			view: {
				def: {width: 470, height: 716},
				min: {height: 716},
				max: {height: 716}
			},
			xAxis: {
				show: true,
				showLabel: true,
				label: 'Average %',
				defaultHeight: 20,
				tickFormatting: Utils.formatTrunc
			},
			yAxis: {
				show: true,
				showLabel: true,
				label: 'Sector (CPV Division)',
				defaultWidth: 130,
				maxLength: 20,
				tickFormatting: Utils.formatCPVName
			},
			valueFormatting: Utils.formatPercent,
			showGridLines: true,
			gradient: false,
			colorScheme: {
				domain: Consts.colors.diverging
			}
		},
		select: (event) => {
		},
		onLegendLabelClick: (event) => {
		},
		data: []
	};
	cpvs_codes_absolute: IChartBar = {
		visible: false,
		chart: {
			schemeType: 'ordinal',
			view: {
				def: {width: 470, height: 716},
				min: {height: 716},
				max: {height: 716}
			},
			xAxis: {
				show: true,
				showLabel: true,
				label: 'Nr. of Tenders',
				defaultHeight: 20,
				tickFormatting: Utils.formatTrunc
			},
			yAxis: {
				show: true,
				showLabel: true,
				label: 'Sector (CPV Division)',
				defaultWidth: 130,
				maxLength: 20,
				tickFormatting: Utils.formatCPVName
			},
			valueFormatting: Utils.formatValue,
			showGridLines: true,
			gradient: false,
			colorScheme: {
				domain: Consts.colors.diverging
			}
		},
		select: (event) => {
		},
		onLegendLabelClick: (event) => {
		},
		data: []
	};

	graph: IChartBar = this.cpvs_codes_average;

	constructor() {
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.cpvs_codes_average.data = [];
		this.cpvs_codes_absolute.data = [];
		if (this.data) {
			this.cpvs_codes_average.data = Object.keys(this.data).map((key) => {
				return {name: this.data[key].name, value: this.data[key].percent};
			});
			this.cpvs_codes_absolute.data = Object.keys(this.data).map((key) => {
				return {name: this.data[key].name, value: this.data[key].value};
			});
		}
		this.cpvs_codes_average.visible = this.cpvs_codes_average.data.length > 0;
		this.cpvs_codes_absolute.visible = this.cpvs_codes_absolute.data.length > 0;
	}

}
