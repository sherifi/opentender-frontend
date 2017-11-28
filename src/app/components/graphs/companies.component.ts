import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ICompany, ISeriesProvider, IStatsCompanies} from '../../app.interfaces';
import {IChartBar} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {Router} from '@angular/router';
import {Utils} from '../../model/utils';
import {Consts} from '../../model/consts';
import {I18NService} from '../../services/i18n.service';

@Component({
	selector: 'graph[companies]',
	template: `
		<div class="graph-title">{{title}}</div>
		<div class="graph-toolbar-container">
			<div class="graph-toolbar graph-toolbar-left">
				<button class="tool-button" [ngClass]="{down:mode==='nr'}" (click)="toggleValue('nr')" i18n>Nr. of Tenders</button>
				<button class="tool-button" [ngClass]="{down:mode==='vol'}" (click)="toggleValue('vol')" i18n>Volume (€)</button>
			</div>
		</div>
		<ngx-charts-bar-horizontal-labeled
				class="chart-container"
				[chart]="graph.chart"
				[data]="graph.data"
				(select)="graph.select($event)"
				(legendLabelClick)="graph.onLegendLabelClick($event)">
		</ngx-charts-bar-horizontal-labeled>
		<select-series-download-button [sender]="this"></select-series-download-button>
	`
})
export class GraphCompaniesComponent implements OnChanges, ISeriesProvider {
	@Input()
	title: string;
	@Input()
	data: {
		absolute: IStatsCompanies,
		volume: IStatsCompanies,
	};
	mode: string = 'nr';

	companies_absolute: IChartBar = {
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
				minInterval: 1,
				defaultHeight: 20,
				tickFormatting: Utils.formatValue
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
			colorScheme: {
				domain: Consts.colors.single4
			}
		},
		select: (event) => {
			this.router.navigate(['/company/' + event.id]);
		},
		onLegendLabelClick: (event) => {
		},
		data: null
	};

	companies_volume: IChartBar = {
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
				tickFormatting: Utils.formatCurrencyValue
			},
			yAxis: {
				show: false,
				showLabel: true,
				defaultWidth: 150,
				maxLength: 24,
			},
			valueFormatting: Utils.formatCurrencyValueEUR,
			showGridLines: true,
			gradient: false,
			colorScheme: {
				domain: Consts.colors.single4
			}
		},
		select: (event) => {
			this.router.navigate(['/company/' + event.id]);
		},
		onLegendLabelClick: (event) => {
		},
		data: null
	};

	graph = this.companies_absolute;

	constructor(private router: Router, private i18n: I18NService) {
		this.companies_absolute.chart.xAxis.label = this.i18n.get('Nr. of Tenders');
		this.companies_absolute.chart.yAxis.label = this.i18n.get('Supplier');
		this.companies_volume.chart.xAxis.label = this.i18n.get('Total Volume of Tenders (€)');
		this.companies_volume.chart.yAxis.label = this.i18n.get('Supplier');
	}

	ngOnChanges(changes: SimpleChanges): void {
		let companies: Array<ICompany> = this.data && this.data.absolute && this.data.absolute.top10 ? this.data.absolute.top10 : [];
		this.companies_absolute.data = companies.filter(company => company.body.id).map((company) => {
			return {id: company.body.id, name: Utils.nameGuard(company.body.name), value: company.value};
		}).reverse();

		companies = this.data && this.data.volume && this.data.volume.top10 ? this.data.volume.top10 : [];
		this.companies_volume.data = companies.filter(company => company.body.id).map((company) => {
			return {id: company.body.id, name: Utils.nameGuard(company.body.name), value: company.value};
		}).reverse();
	}

	getSeriesInfo() {
		return {data: this.graph.data, header: {value: this.graph.chart.xAxis.label, name: this.i18n.get('Name')}, filename: 'suppliers'};
	}

	toggleValue(mode: string) {
		this.mode = mode;
		this.displayActive();
	}

	displayActive() {
		if (this.mode === 'nr') {
			this.graph = this.companies_absolute;
		} else if (this.mode === 'vol') {
			this.graph = this.companies_volume;
		}
	}
}
