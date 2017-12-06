import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ISeriesProvider, IStats} from '../../app.interfaces';
import {IChartBar} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {Utils} from '../../model/utils';
import {Consts} from '../../model/consts';
import {PlatformService} from '../../services/platform.service';

@Component({
	selector: 'graph[benchmarks]',
	template: `
		<div class="graph-title">{{title}}</div>
		<div class="select-container">
			<div class="select-radios">
				<label class="checkbox" *ngFor="let group of benchmark_groups">
					<input [value]="group" name="group" type="radio" [(ngModel)]="active.benchmark_group" (change)="handleGroupChange()">
					{{group.name}}
				</label>
			</div>
			<div class="select-radios" *ngIf="active.benchmark_group">
				<label class="checkbox" *ngFor="let bench of active.benchmark_group.benchmarks">
					<input [value]="bench" name="bench" type="radio" [(ngModel)]="active.benchmark" (change)="handleBenchmarkChange()">
					{{bench.name}}
				</label>
			</div>
		</div>
		<ngx-charts-bar-vertical-grouped
				class="chart-container"
				[chart]="graph.chart"
				[data]="graph.data"
				(select)="graph.select($event)"
				(legendLabelClick)="graph.onLegendLabelClick($event)">
		</ngx-charts-bar-vertical-grouped>
		<select-series-download-button [sender]="this"></select-series-download-button>
	`
})
export class GraphBenchmarksComponent implements OnChanges, ISeriesProvider {
	@Input()
	title: string;
	@Input()
	entityTitle: string;
	@Input()
	othersTitle: string;
	@Input()
	data: IStats;

	in_years: IChartBar = {
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
			legend: {
				show: false,
				title: 'Legend'
			},
			valueFormatting: Utils.formatTrunc,
			showGridLines: true,
			gradient: false,
			colorScheme: {
				domain: Consts.colors.dual
			}
		},
		select: (event) => {
		},
		onLegendLabelClick: (event) => {
		},
		data: null
	};

	graph = this.in_years;

	benchmark_groups = [];
	active = {
		benchmark_group: null,
		benchmark: null
	};

	constructor(private platform: PlatformService) {
		this.in_years.chart.xAxis.label = 'Year';
	}

	collectYears(entity, compare): Array<string> {
		let years = Object.keys(entity);
		Object.keys(compare).forEach(key => {
			if (years.indexOf(key) < 0) {
				years.push(key);
			}
		});
		years.sort((a, b) => {
			if (a < b) {
				return -1;
			}
			if (a > b) {
				return 1;
			}
			return 0;
		});
		return years;
	}

	buildCompareScoreSeries(stats: IStats, id: string) {
		let entity = stats.histogram_indicators[id];
		let compare = stats.benchmark.histogram_indicators[id];
		if (!entity || !compare) {
			return [];
		}
		let series = [];
		let years = this.collectYears(entity, compare);
		years.forEach(year => {
			let sub = {name: year, series: []};
			if (entity[year] !== undefined) {
				sub.series.push({name: this.entityTitle, value: entity[year]});
			} else {
				sub.series.push({name: this.entityTitle, value: 0, invalid: true});
			}
			if (compare[year] !== undefined) {
				sub.series.push({name: this.othersTitle, value: compare[year]});
			} else {
				sub.series.push({name: this.othersTitle, value: 0, invalid: true});
			}
			series.push(sub);
		});
		return series;
	}

	buildCompareValueSeries(stats: IStats, id: string) {
		let entity = stats.histogram_finalPriceEUR;
		let compare = stats.benchmark.histogram_finalPriceEUR;
		if (!entity || !compare) {
			return [];
		}
		let series = [];
		let years = this.collectYears(entity, compare);
		years.forEach(year => {
			let sub = {name: year, series: []};
			if (entity[year] && entity[year][id] && entity[year][id].value !== null) {
				sub.series.push({name: this.entityTitle, value: entity[year][id].value});
			} else {
				sub.series.push({name: this.entityTitle, value: 0, invalid: true});
			}
			if (compare[year] && compare[year][id] && compare[year][id].value !== null) {
				sub.series.push({name: this.othersTitle, value: compare[year][id].value});
			} else {
				sub.series.push({name: this.othersTitle, value: 0, invalid: true});
			}
			series.push(sub);
		});
		return series;
	}

	getSeriesInfo() {
		return {data: this.graph.data, multi: true, header: {name: this.graph.chart.xAxis.label, value: this.graph.chart.yAxis.label}, filename: 'benchmark'};
	}

	displayBenchmark(benchmark): void {
		this.in_years.data = null;
		if (benchmark) {
			this.graph.chart.yAxis.label = benchmark.name;
			if (benchmark.build === 'values') {
				this.graph.chart.yAxis.defaultWidth = 60;
				this.graph.chart.yAxis.tickFormatting = Utils.formatCurrencyValue;
				this.graph.chart.valueFormatting = Utils.formatCurrencyValueEUR;
				this.in_years.data = this.buildCompareValueSeries(this.data, benchmark.id);
			} else {
				this.graph.chart.yAxis.defaultWidth = 20;
				this.graph.chart.yAxis.tickFormatting = Utils.formatTrunc;
				this.graph.chart.valueFormatting = Utils.formatTrunc;
				this.in_years.data = this.buildCompareScoreSeries(this.data, benchmark.id);
			}
		}
	}

	handleGroupChange(): void {
		this.active.benchmark = null;
		if (this.active.benchmark_group) {
			this.active.benchmark = this.active.benchmark_group.benchmarks[0];
		}
		this.handleBenchmarkChange();
	}

	handleBenchmarkChange(): void {
		this.displayBenchmark(this.active.benchmark);
	}

	ngOnChanges(changes: SimpleChanges): void {
		let stats = this.data;
		this.benchmark_groups = [];
		if (!stats) {
			this.handleGroupChange();
			return;
		}
		let goodgroup = {
			name: 'Overall', benchmarks: [
				{name: 'Good Procurement Score', id: 'TENDER', build: 'scores'}
			]
		};
		this.benchmark_groups.push(goodgroup);

		Object.keys(Consts.indicators).forEach(i_key => {
			let indicator = Consts.indicators[i_key];
			let group = {name: indicator.plural, benchmarks: []};
			Object.keys(stats.histogram_indicators).forEach(key => {
				if (key === indicator.id) {
					group.benchmarks.unshift({name: indicator.name + ' Score', id: key, build: 'scores'});
				} else if (key.indexOf(indicator.id) === 0) {
					group.benchmarks.push({name: Utils.formatIndicatorName(key), id: key, build: 'scores'});
				}
			});
			if (group.benchmarks.length > 0) {
				this.benchmark_groups.push(group);
			}
		});

		let valuesgroup = {
			name: 'Contract Values', benchmarks: [
				{name: 'Average Value (€)', id: 'avg_finalPriceEUR', build: 'values'}
			]
		};
		this.benchmark_groups.push(valuesgroup);

		this.active.benchmark_group = this.benchmark_groups[0];
		this.handleGroupChange();
	}

}
