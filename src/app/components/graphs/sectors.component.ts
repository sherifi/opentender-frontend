import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Utils} from '../../model/utils';
import {Consts} from '../../model/consts';
import {IChartBar} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {IStatsPcCpvs} from '../../app.interfaces';

@Component({
	selector: 'graph[sectors]',
	template: `
		<div class="title">Sectors</div>
		<ngx-charts-bar-horizontal
				class="chart-container"
				[chart]="graph.chart"
				[data]="graph.data"
				(select)="graph.select($event)"
				(legendLabelClick)="graph.onLegendLabelClick($event)">
		</ngx-charts-bar-horizontal>`
})
export class GraphSectorsComponent implements OnChanges {
	@Input()
	data: IStatsPcCpvs;

	cpvs_codes_absolute: IChartBar = {
		visible: false,
		chart: {
			schemeType: 'ordinal',
			view: {
				def: {width: 470, height: 320},
				min: {height: 320},
				max: {height: 320}
			},
			xAxis: {
				show: true,
				showLabel: true,
				label: 'Nr. of Tenders in Sector',
				minInterval: 1,
				defaultHeight: 20,
				tickFormatting: Utils.formatTrunc
			},
			yAxis: {
				show: true,
				showLabel: true,
				label: 'Sector (CPV)',
				defaultWidth: 150,
				maxLength: 24,
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

	graph: IChartBar = this.cpvs_codes_absolute;

	constructor() {
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.cpvs_codes_absolute.data = [];
		if (this.data) {
			this.cpvs_codes_absolute.data = Object.keys(this.data).map((key) => {
				return {name: this.data[key].name, value: this.data[key].value};
			});
			this.cpvs_codes_absolute.data.sort((a, b) => {
				if (a.value > b.value) {
					return -1;
				}
				if (a.value < b.value) {
					return 1;
				}
				return 0;
			});
			let othergroup;
			let othergroupcount = 0;
			while (this.cpvs_codes_absolute.data.length > 9) {
				if (!othergroup) {
					othergroup = {name: '', value: 0};
				}
				let last = this.cpvs_codes_absolute.data.pop();
				othergroup.value += last.value;
				othergroupcount++;
				othergroup.name = othergroupcount + ' other Sectors < ' + last.value;
			}
			if (othergroup) {
				this.cpvs_codes_absolute.data.push(othergroup);
			}
			this.cpvs_codes_absolute.data = this.cpvs_codes_absolute.data.reverse();
		}
		this.cpvs_codes_absolute.visible = this.cpvs_codes_absolute.data.length > 0;
	}

}
