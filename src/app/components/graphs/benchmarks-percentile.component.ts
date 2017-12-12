import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {IBenchmarkFilter, ISeriesProvider, IStatsPercentileInYears} from '../../app.interfaces';
import {IChartHeatmap} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {Utils} from '../../model/utils';
import {Consts} from '../../model/consts';

@Component({
	selector: 'graph[benchmarks-percentile]',
	template: `
		<div class="graph-title">{{title}}</div>
		<div class="benchmark-select">
			<div class="select-radios">
				<div>Value Group</div>
				<label class="checkbox" *ngFor="let group of benchmark_groups">
					<input [value]="group" name="group" type="radio" [(ngModel)]="active.benchmark_group" (change)="handleGroupChange()">
					{{group.name}}
				</label>
			</div>
			<div class="select-radios" *ngIf="active.benchmark_group">
				<div>Value</div>
				<label class="checkbox" *ngFor="let bench of active.benchmark_group.benchmarks">
					<input [value]="bench" name="bench" type="radio" [(ngModel)]="active.benchmark" (change)="handleBenchmarkChange()">
					{{bench.name}}
				</label>
			</div>
			<div class="select-checks">
				<div>Comparision</div>
				<label class="checkbox" *ngFor="let filter of filters">
					<input [value]="true" name="filter" type="checkbox" [(ngModel)]="filter.active" (change)="handleFilterChange()">
					{{filter.name}}
				</label>
			</div>
		</div>
		<ngx-charts-heat-map-grid
				class="chart-container"
				[chart]="graph.chart"
				[data]="graph.data"
				(select)="graph.select($event)"
				(legendLabelClick)="graph.onLegendLabelClick($event)"></ngx-charts-heat-map-grid>
		<select-series-download-button [sender]="this"></select-series-download-button>
	`,
	styleUrls: ['benchmarks.component.scss']
})
export class GraphBenchmarksPercentileComponent implements OnChanges, ISeriesProvider {
	@Input()
	title: string;
	@Input()
	entityTitle: string;
	@Input()
	othersTitle: string;
	@Input()
	data: IStatsPercentileInYears;
	@Input()
	filters: Array<IBenchmarkFilter> = [];
	@Output()
	filtersChange = new EventEmitter();

	histogramm_percentile: IChartHeatmap = {
		chart: {
			schemeType: 'ordinal',
			view: {
				def: {width: 1024, height: 360},
				min: {height: 360},
				max: {height: 360}
			},
			xAxis: {
				show: true,
				showLabel: true,
				minInterval: 1,
				defaultHeight: 20,
				// tickFormatting: Utils.formatValue
			},
			yAxis: {
				show: true,
				showLabel: true,
				defaultWidth: 150,
				maxLength: 24,
			},
			// valueFormatting: Utils.formatValue,
			showGridLines: true,
			gradient: false,
			colorScheme: {
				domain: Consts.colors.single
			}
		},
		select: (event) => {
			// this.router.navigate(['/company/' + event.id]);
		},
		onLegendLabelClick: (event) => {
		},
		data: null
	};

	graph = this.histogramm_percentile;

	benchmark_groups = [];
	active = {
		benchmark_group: null,
		benchmark: null
	};

	constructor() {
		this.benchmark_groups = [];
		this.benchmark_groups.push({
			name: 'Overall', benchmarks: [
				{name: 'Good Procurement Score', id: 'TENDER'}
			]
		});
		Object.keys(Consts.indicators).forEach(i_key => {
			let indicator = Consts.indicators[i_key];
			let group = {name: indicator.plural, benchmarks: [{name: indicator.name + ' Score', id: i_key}]};
			Object.keys(indicator.subindicators).forEach(key => {
				if (!indicator.subindicators[key].notused) {
					group.benchmarks.push({name: Utils.formatIndicatorName(key), id: key});
				}
			});
			this.benchmark_groups.push(group);
		});
		this.active.benchmark_group = this.benchmark_groups[0];
		this.handleGroupChange();
	}


	getSeriesInfo() {
		return {data: this.graph.data, multi: true, header: {name: this.graph.chart.xAxis.label, value: this.graph.chart.yAxis.label}, filename: 'benchmark'};
	}

	displayBenchmark(benchmark): void {
		this.graph.data = null;
		if (benchmark && this.data) {
			this.graph.chart.xAxis.label = benchmark.name;
			let o = this.data[benchmark.id];
			if (!o) {
				this.graph.data = [];
				return;
			}
			let d = {};
			Object.keys(o).forEach(year => {
				let yd = o[year];
				let val = null;
				Object.keys(yd).forEach(percentile => {
					d[percentile] = d[percentile] || {name: 'Percentile ' + percentile, series: []};
					let pval = yd[percentile];
					if (pval !== null) {
						if (val === null) {
							val = pval;
						} else {
							let newval = pval;
							pval = pval - val;
							val = newval;
						}
					} else {
						val = null;
					}
					d[percentile].series.push({name: year, value: pval});
				});
			});
			this.graph.data = Object.keys(d).map(key => d[key]);
		}
	}

	handleGroupChange(): void {
		this.active.benchmark = null;
		if (this.active.benchmark_group) {
			this.active.benchmark = this.active.benchmark_group.benchmarks[0];
		}
		this.handleBenchmarkChange();
	}

	handleFilterChange(): void {
		this.filtersChange.emit({});
	}

	handleBenchmarkChange(): void {
		this.displayBenchmark(this.active.benchmark);
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.handleBenchmarkChange();
	}

}
