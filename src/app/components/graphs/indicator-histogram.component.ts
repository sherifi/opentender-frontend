import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Utils} from '../../model/utils';
import {Consts} from '../../model/consts';
import {IChartBar} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {IStatsPcPricesLotsInYears} from '../../app.interfaces';

@Component({
	selector: 'graph[indicator-histogram]',
	template: `
		<div class="graph-title">Contracts (Lots) with {{indicator}} per Year</div>
		<div class="graph-toolbar">
			<button class="tool-button" [ngClass]="{down:this.graph==this.lots_pc_in_years}" (click)="this.graph=this.lots_pc_in_years">Average</button>
			<button class="tool-button" [ngClass]="{down:this.graph==this.lots_in_years}" (click)="this.graph=this.lots_in_years">Absolute</button>
			<button class="tool-button" [ngClass]="{down:this.graph==this.sums_Prices_in_years}" (click)="this.graph=this.sums_Prices_in_years">Volume (€)</button>
		</div>
		<ngx-charts-bar-vertical
				class="chart-container"
				[chart]="graph.chart"
				[data]="graph.data"
				(select)="graph.select($event)"
				(legendLabelClick)="graph.onLegendLabelClick($event)">
		</ngx-charts-bar-vertical>`
})
export class GraphIndicatorHistogramComponent implements OnChanges {
	@Input()
	data: IStatsPcPricesLotsInYears;
	@Input()
	indicator: string = 'Indicators';

	lots_pc_in_years: IChartBar = {
		chart: {
			schemeType: 'ordinal',
			view: {
				def: {width: 500, height: 330},
				min: {height: 320},
				max: {height: 320}
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
				label: '% of Contracts',
				defaultWidth: 30,
				minInterval: 5,
				tickFormatting: Utils.formatTrunc
			},
			valueFormatting: Utils.formatPercent,
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

	lots_in_years: IChartBar = {
		chart: {
			schemeType: 'ordinal',
			view: {
				def: {width: 500, height: 330},
				min: {height: 320},
				max: {height: 320}
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

	sums_Prices_in_years: IChartBar = {
		chart: {
			schemeType: 'ordinal',
			view: {
				def: {width: 500, height: 330},
				min: {height: 320},
				max: {height: 320}
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
				label: 'Volumne of Contracts (€)',
				defaultWidth: 80,
				tickFormatting: Utils.formatCurrencyValue
			},
			valueFormatting: (value: number) => {
				return '€ ' + Utils.formatCurrencyValue(value);
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

	graph: IChartBar = this.lots_pc_in_years;

	constructor() {
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.lots_pc_in_years.data = null;
		this.lots_in_years.data = null;
		if (this.data) {
			this.lots_pc_in_years.data = Object.keys(this.data).map((key) => {
				return {name: key, value: this.data[key].percent};
			});
			this.lots_in_years.data = Object.keys(this.data).map((key) => {
				return {name: key, value: this.data[key].value};
			});
			this.sums_Prices_in_years.data = Object.keys(this.data).map((key) => {
				return {name: key, value: this.data[key].sums_finalPrice['EUR'] || 0};
			});
		}
	}

}
