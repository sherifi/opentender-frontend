import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Utils} from '../../model/utils';
import {Consts} from '../../model/consts';
import {IChartBar} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {IStatsPcPricesLotsInYears} from '../../app.interfaces';

@Component({
	selector: 'graph[indicator-histogram]',
	template: `
		<div class="graph-title" i18n>{{title}} in Time</div>
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
		<div class="graph-footer">
			<div class="graph-toolbar-container">
				<div class="graph-toolbar">
					<button class="tool-button" (click)="this.download('csv')" title="Download data as CSV"><i class="icon-cloud-download"></i> CSV</button>
					<button class="tool-button" (click)="this.download('json')" title="Download data as JSON"><i class="icon-cloud-download"></i> JSON</button>
				</div>
			</div>
		</div>`
})
export class GraphIndicatorHistogramComponent implements OnChanges {
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
				label: 'Year',
				defaultHeight: 20,
				tickFormatting: Utils.formatYear
			},
			yAxis: {
				show: true,
				showLabel: true,
				label: 'Average % of Contracts (Lots)',
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
				label: 'Year',
				defaultHeight: 20,
				tickFormatting: Utils.formatYear
			},
			yAxis: {
				show: true,
				showLabel: true,
				label: 'Average Indicator Score',
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
				label: 'Year',
				defaultHeight: 20,
				tickFormatting: Utils.formatYear
			},
			yAxis: {
				show: true,
				showLabel: true,
				label: 'Nr. of Contracts (Lots)',
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
				label: 'Year',
				defaultHeight: 20,
				tickFormatting: Utils.formatYear
			},
			yAxis: {
				show: true,
				showLabel: true,
				label: 'Sum of Indicator Score',
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
				label: 'Year',
				defaultHeight: 20,
				tickFormatting: Utils.formatYear
			},
			yAxis: {
				show: true,
				showLabel: true,
				label: 'Volume of Contracts (€)',
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
				label: 'Year',
				defaultHeight: 20,
				tickFormatting: Utils.formatYear
			},
			yAxis: {
				show: true,
				showLabel: true,
				label: 'Average Volume of Contracts (€)',
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

	constructor() {
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

	download(format): void {
		Utils.downloadSeries(format, this.graph.data, {value: this.graph.chart.yAxis.label, name: 'Year'},  this.title + '-histogram');
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
