import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IAuthority, IStatsAuthorities} from '../../app.interfaces';
import {IChartBar} from '../../thirdparty/ngx-charts-universal/chart.interface';
import {Router} from '@angular/router';
import {Consts} from '../../model/consts';
import {Utils} from '../../model/utils';

@Component({
	selector: 'graph[authorities]',
	template: `
		<div class="graph-title" i18n>Main buyers</div>
		<div class="graph-toolbar-container">
			<div class="graph-toolbar graph-toolbar-left">
				<button class="tool-button" [ngClass]="{down:mode==='nr'}" (click)="toggleValue('nr')" i18n>Nr. of Contracts</button>
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
	`
})
export class GraphAuthoritiesComponent implements OnChanges {
	@Input()
	data: {
		absolute: IStatsAuthorities,
		volume: IStatsAuthorities,
	};
	mode: string = 'nr';

	authorities_absolute: IChartBar = {
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
				label: 'Nr. of Contracts',
				minInterval: 1,
				defaultHeight: 20,
				tickFormatting: Utils.formatValue
			},
			yAxis: {
				show: false,
				showLabel: true,
				label: 'Buyer',
				defaultWidth: 150,
				maxLength: 24,
			},
			valueFormatting: Utils.formatValue,
			showGridLines: true,
			gradient: false,
			colorScheme: {
				domain: Consts.colors.single3
			}
		},
		select: (event) => {
			this.router.navigate(['/authority/' + event.id]);
		},
		onLegendLabelClick: (event) => {
		},
		data: null
	};

	authorities_volume: IChartBar = {
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
				label: 'Total Volume of Contracts (€)',
				defaultHeight: 20,
				tickFormatting: Utils.formatCurrencyValue
			},
			yAxis: {
				show: false,
				showLabel: true,
				label: 'Buyer',
				defaultWidth: 150,
				maxLength: 24,
			},
			valueFormatting: Utils.formatCurrencyValueEUR,
			showGridLines: true,
			gradient: false,
			colorScheme: {
				domain: Consts.colors.single3
			}
		},
		select: (event) => {
			this.router.navigate(['/authority/' + event.id]);
		},
		onLegendLabelClick: (event) => {
		},
		data: null
	};

	graph = this.authorities_absolute;

	constructor(private router: Router) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		let authorities: Array<IAuthority> = this.data && this.data.absolute && this.data.absolute.top10 ? this.data.absolute.top10 : [];
		this.authorities_absolute.data = authorities.map((authority) => {
			return {id: authority.body.groupId, name: authority.body.name, value: authority.value};
		}).sort((a, b) => {
			if (a.value < b.value) {
				return -1;
			}
			if (a.value > b.value) {
				return 1;
			}
			return 0;
		});

		authorities = this.data && this.data.volume && this.data.volume.top10 ? this.data.volume.top10 : [];
		this.authorities_volume.data = authorities.map((authority) => {
			return {id: authority.body.groupId, name: authority.body.name, value: authority.value};
		}).sort((a, b) => {
			if (a.value < b.value) {
				return -1;
			}
			if (a.value > b.value) {
				return 1;
			}
			return 0;
		});
	}

	toggleValue(mode: string) {
		this.mode = mode;
		this.displayActive();
	}

	displayActive() {
		if (this.mode === 'nr') {
			this.graph = this.authorities_absolute;
		} else if (this.mode === 'vol') {
			this.graph = this.authorities_volume;
		}
	}

}
