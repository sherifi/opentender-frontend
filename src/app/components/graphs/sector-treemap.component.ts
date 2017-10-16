import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Utils} from '../../model/utils';
import {Consts} from '../../model/consts';
import {IChartTreeMap} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {ISector, ISeriesProvider, IStats} from '../../app.interfaces';
import {Router} from '@angular/router';
import {I18NService} from '../../services/i18n.service';

@Component({
	selector: 'graph[sector-treemap]',
	template: `
		<div class="graph-header">
			<div class="graph-title" i18n>Sector Overview</div>
			<div class="graph-toolbar-container">
				<div class="graph-toolbar">
					<button class="tool-button" [ngClass]="{down:this.graph==this.cpv_codes_prices}" (click)="this.graph=this.cpv_codes_prices" i18n>Volume (€)</button>
					<button class="tool-button" [ngClass]="{down:this.graph==this.cpv_codes_nr}" (click)="this.graph=this.cpv_codes_nr" i18n>Nr. of Contracts</button>
				</div>
			</div>
		</div>
		<ngx-charts-tree-map
				class="chart-container"
				[chart]="graph.chart"
				[data]=" graph.data"
				(select)="graph.select($event)"
				(legendLabelClick)="graph.onLegendLabelClick($event)">
		</ngx-charts-tree-map>
		<select-series-download-button [sender]="this"></select-series-download-button>`
})
export class GraphSectorTreemap implements OnChanges, ISeriesProvider {
	@Input()
	data: Array<{ sector: ISector; stats: IStats }>;

	cpv_codes_nr: IChartTreeMap = {
		chart: {
			schemeType: 'ordinal',
			view: {
				def: {width: 1024, height: 400},
				min: {height: 400},
				max: {height: 400}
			},
			colorScheme: {
				'domain': Consts.colors.diverging,
				getColor: (value) => {
					return Utils.cpv2color(value);
				}
			},
			valueFormatting: Utils.formatValue
		},
		select: (event) => {
			this.router.navigate(['/sector/' + event.id]);
		},
		data: null
	};

	cpv_codes_prices: IChartTreeMap = {
		chart: {
			schemeType: 'ordinal',
			view: {
				def: {width: 1024, height: 400},
				min: {height: 400},
				max: {height: 400}
			},
			colorScheme: {
				'domain': Consts.colors.diverging,
				getColor: (value) => {
					return Utils.cpv2color(value);
				}
			},
			valueFormatting: (n: number): string => {
				return '€ ' + Utils.formatValue(n);
			}
		},
		select: (event) => {
			this.router.navigate(['/sector/' + event.id]);
		},
		data: null
	};

	graph: IChartTreeMap = this.cpv_codes_prices;

	constructor(private router: Router, private i18n: I18NService) {
		this.cpv_codes_nr.chart.legend = {title: i18n.get('Nr, of Contracts')};
		this.cpv_codes_prices.chart.legend = {title: i18n.get('Volume (€)')};
	}

	getSeriesInfo() {
		return {data: this.graph.data, header: {value: this.graph.chart.legend.title, name: 'CPV Name', id: 'CPV Nr.'}, filename: 'subsector-overview'};
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.cpv_codes_nr.data = null;
		this.cpv_codes_prices.data = null;
		if (this.data) {
			this.cpv_codes_nr.data = this.data.map(s => {
				return {name: s.sector.name, value: s.sector.value, id: s.sector.id};
			});
			this.cpv_codes_prices.data = this.data.map(s => {
				return {name: s.sector.name, value: s.stats.sum_finalPriceEUR.value || 0, id: s.sector.id};
			});
		}
	}

}
