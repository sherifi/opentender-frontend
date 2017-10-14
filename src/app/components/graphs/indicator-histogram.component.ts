import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Utils} from '../../model/utils';
import {Consts} from '../../model/consts';
import {IChartBar} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {ISeriesProvider, IStatsPcPricesLotsInYears} from '../../app.interfaces';
import {I18NService} from '../../services/i18n.service';

@Component({
	selector: 'graph[indicator-histogram]',
	template: `
		<div class="graph-title" i18n>{{title}} over Time</div>
		<div class="graph-toolbar-container">
			<div class="graph-toolbar graph-toolbar-left">
				<button class="tool-button" [ngClass]="{down:mode==='nr'}" (click)="toggleValue('nr')" i18n>Nr. of Contracts</button>
				<button class="tool-button" [ngClass]="{down:mode==='vol'}" (click)="toggleValue('vol')" i18n>Volume (€)</button>
				<!--<button class="tool-button" [ngClass]="{down:mode==='score'}" (click)="toggleValue('score')" i18n>Score</button>-->
			</div>
			<div class="graph-toolbar graph-toolbar-right">
				<button class="tool-button" [ngClass]="{down:!absolute}" (click)="toggleAbsolute(false)" i18n>Average</button>
				<button class="tool-button" [ngClass]="{down:absolute}" (click)="toggleAbsolute(true)" i18n>Absolute</button>
			</div>
		</div>
		<ngx-charts-bar-vertical
				class="chart-container"
				[chart]="graph.chart"
				[data]="graph.data"
				(select)="graph.select($event)"
				(legendLabelClick)="graph.onLegendLabelClick($event)">
		</ngx-charts-bar-vertical>
		<select-series-download-button [sender]="this"></select-series-download-button>`
})
export class GraphIndicatorHistogramComponent implements OnChanges, ISeriesProvider {
	@Input()
	data: IStatsPcPricesLotsInYears;
	@Input()
	title: string = '';

	absolute: boolean = false;
	mode: string = 'nr';

	avg_lots_in_years: IChartBar = {
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
				defaultHeight: 20,
				tickFormatting: Utils.formatYear
			},
			yAxis: {
				show: true,
				showLabel: true,
				defaultWidth: 30,
				minInterval: 1,
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

	avg_scores_in_years: IChartBar = {
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
				defaultHeight: 20,
				tickFormatting: Utils.formatYear
			},
			yAxis: {
				show: true,
				showLabel: true,
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
		data: []
	};

	sum_lots_in_years: IChartBar = {
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
				defaultHeight: 20,
				tickFormatting: Utils.formatYear
			},
			yAxis: {
				show: true,
				showLabel: true,
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

	sum_scores_in_years: IChartBar = {
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
				defaultHeight: 20,
				tickFormatting: Utils.formatYear
			},
			yAxis: {
				show: true,
				showLabel: true,
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
		data: []
	};

	sum_prices_in_years: IChartBar = {
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
				defaultHeight: 20,
				tickFormatting: Utils.formatYear
			},
			yAxis: {
				show: true,
				showLabel: true,
				defaultWidth: 80,
				tickFormatting: Utils.formatCurrencyValue
			},
			valueFormatting: Utils.formatCurrencyValueEUR,
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

	avg_prices_in_years: IChartBar = {
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
				defaultHeight: 20,
				tickFormatting: Utils.formatYear
			},
			yAxis: {
				show: true,
				showLabel: true,
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

	graph: IChartBar = this.avg_lots_in_years;

	constructor(private i18n: I18NService) {
		let year = this.i18n.get('Year');
		this.avg_lots_in_years.chart.xAxis.label = year;
		this.avg_lots_in_years.chart.yAxis.label = this.i18n.get('Average % of Contracts (Lots)');
		this.avg_scores_in_years.chart.xAxis.label = year;
		this.avg_scores_in_years.chart.yAxis.label = this.i18n.get('Average Indicator Score');
		this.sum_lots_in_years.chart.xAxis.label = year;
		this.sum_lots_in_years.chart.yAxis.label = this.i18n.get('Nr. of Contracts (Lots)');
		this.sum_scores_in_years.chart.xAxis.label = year;
		this.sum_scores_in_years.chart.yAxis.label = this.i18n.get('Sum of Indicator Score');
		this.sum_prices_in_years.chart.xAxis.label = year;
		this.sum_prices_in_years.chart.yAxis.label = this.i18n.get('Volume of Contracts (€)');
		this.avg_prices_in_years.chart.xAxis.label = year;
		this.avg_prices_in_years.chart.yAxis.label = this.i18n.get('Average Volume of Contracts (€)');
	}


	toggleAbsolute(val: boolean) {
		this.absolute = val;
		this.displayActive();
	}

	toggleValue(mode: string) {
		this.mode = mode;
		this.displayActive();
	}

	displayActive() {
		if (this.mode === 'nr') {
			this.graph = this.absolute ? this.sum_lots_in_years : this.avg_lots_in_years;
		} else if (this.mode === 'vol') {
			this.graph = this.absolute ? this.sum_prices_in_years : this.avg_prices_in_years;
		} else if (this.mode === 'score') {
			this.graph = this.absolute ? this.sum_scores_in_years : this.avg_scores_in_years;
		}
	}

	getSeriesInfo() {
		return {data: this.graph.data, header: {value: this.graph.chart.yAxis.label, name: 'Year'}, filename: 'histogram'};
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.avg_lots_in_years.data = null;
		this.sum_lots_in_years.data = null;
		this.sum_prices_in_years.data = null;
		this.avg_prices_in_years.data = null;
		if (this.data) {
			this.avg_lots_in_years.data = Object.keys(this.data).map((key) => {
				return {name: key, value: this.data[key].percent};
			});
			this.sum_lots_in_years.data = Object.keys(this.data).map((key) => {
				return {name: key, value: this.data[key].value};
			});
			this.sum_prices_in_years.data = Object.keys(this.data).map((key) => {
				return {name: key, value: this.data[key].sums_finalPrice['EUR'] || 0};
			});
			this.avg_prices_in_years.data = Object.keys(this.data).map((key) => {
				return {name: key, value: this.data[key].avgs_finalPrice['EUR'] || 0};
			});
		}
	}

}
