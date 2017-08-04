import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Utils} from '../../model/utils';
import {Consts} from '../../model/consts';
import {IChartBar} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {IStatsPcCpvs} from '../../app.interfaces';
import {Router} from '@angular/router';

@Component({
	selector: 'graph[indicator-sectors]',
	template: `
		<div class="graph-title">Tenders with {{indicator}} per Sector</div>
		<div class="graph-toolbar-container">
			<div class="graph-toolbar graph-toolbar-right">
				<button class="tool-button" [ngClass]="{down:this.graph==this.cpvs_codes_average}" (click)="this.graph=this.cpvs_codes_average">Average</button>
				<button class="tool-button" [ngClass]="{down:this.graph==this.cpvs_codes_absolute}" (click)="this.graph=this.cpvs_codes_absolute">Absolute</button>
			</div>
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
	data: IStatsPcCpvs;
	@Input()
	indicator: string = 'Indicators';

	cpvs_codes_average: IChartBar = {
		chart: {
			schemeType: 'ordinal',
			view: {
				def: {width: 500, height: 722},
				min: {height: 722},
				max: {height: 722}
			},
			xAxis: {
				show: true,
				showLabel: true,
				label: 'Average % of Contracts',
				defaultHeight: 20,
				tickFormatting: Utils.formatTrunc
			},
			yAxis: {
				show: true,
				showLabel: true,
				label: 'Sector (CPV Division)',
				defaultWidth: 150,
				maxLength: 24,
				tickFormatting: Utils.formatCPVName
			},
			valueFormatting: Utils.formatPercent,
			showGridLines: true,
			gradient: false,
			colorScheme: {
				domain: Consts.colors.single2
			}
		},
		select: (event) => {
			this.router.navigate(['/sector/' + event.id]);
		},
		onLegendLabelClick: (event) => {
		},
		data: null
	};
	cpvs_codes_absolute: IChartBar = {
		chart: {
			schemeType: 'ordinal',
			view: {
				def: {width: 500, height: 722},
				min: {height: 722},
				max: {height: 722}
			},
			xAxis: {
				show: true,
				showLabel: true,
				label: 'Nr. of Contracts',
				defaultHeight: 20,
				tickFormatting: Utils.formatTrunc
			},
			yAxis: {
				show: true,
				showLabel: true,
				label: 'Sector (CPV Division)',
				defaultWidth: 150,
				maxLength: 24,
				tickFormatting: Utils.formatCPVName
			},
			valueFormatting: Utils.formatValue,
			showGridLines: true,
			gradient: false,
			colorScheme: {
				domain: Consts.colors.single2
			}
		},
		select: (event) => {
			this.router.navigate(['/sector/' + event.id]);
		},
		onLegendLabelClick: (event) => {
		},
		data: null
	};

	graph: IChartBar = this.cpvs_codes_average;

	constructor(private router: Router) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.cpvs_codes_average.data = null;
		this.cpvs_codes_absolute.data = null;
		if (this.data) {
			let codes = Object.keys(this.data).map((key) => {
				return {id: key, name: this.data[key].name, value: this.data[key].value, percent: this.data[key].percent};
			});
			codes.sort((a, b) => {
				if (a.percent < b.percent) {
					return -1;
				}
				if (a.percent > b.percent) {
					return 1;
				}
				return 0;
			});
			this.cpvs_codes_average.data = codes.map((code) => {
				return {id: code.id, name: code.name, value: code.percent};
			});
			this.cpvs_codes_absolute.data = codes.map((code) => {
				return {id: code.id, name: code.name, value: code.value};
			});
		}
	}

}
