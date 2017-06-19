import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {IChartTreeMap} from '../../../thirdparty/ngx-charts-universal/chart.interface';
import {IVizData, ISector} from '../../../app.interfaces';
import {Consts} from '../../../model/consts';
import {Router} from '@angular/router';
import {Utils} from '../../../model/utils';

@Component({
	moduleId: __filename,
	selector: 'market-analysis',
	templateUrl: 'market-analysis.template.html'
})
export class DashboardsMarketAnalysisPage implements OnInit, OnDestroy {
	public error: string;
	public loading = true;
	public sectors: Array<ISector>;

	private charts: {
		cpvs_code_main: IChartTreeMap;
		cpvs_code_main_volume: IChartTreeMap;
	} = {
		cpvs_code_main: {
			visible: false,
			chart: {
				schemeType: 'ordinal',
				view: {
					def: {width: 470, height: 400},
					min: {height: 400},
					max: {height: 400}
				},
				colorScheme: {
					'domain': Consts.colors.diverging
				},
				formatNumber: Utils.formatValue
			},
			select: (event) => {
				this.router.navigate(['/sector/' + event.id]);
			},
			data: []
		},
		cpvs_code_main_volume: {
			visible: false,
			chart: {
				schemeType: 'ordinal',
				view: {
					def: {width: 470, height: 400},
					min: {height: 400},
					max: {height: 400}
				},
				colorScheme: {
					'domain': Consts.colors.diverging
				},
				formatNumber: (n: number): string => {
					return '€ ' + Utils.formatValue(n);
				}
			},
			select: (event) => {
				this.router.navigate(['/sector/' + event.id]);
			},
			data: []
		}
	};

	constructor(private api: ApiService, private router: Router) {
	}

	public ngOnInit(): void {
		this.api.getViz(['sectors_stats']).subscribe(
			(result) => {
				this.display(result.data);
				this.loading = false;
			},
			(error) => {
				this.error = error._body;
				this.loading = false;
				// console.error(error);
			},
			() => {
				// console.log('sector complete');
			});
	}

	public ngOnDestroy(): void {
	}

	display(data: IVizData): void {
		if (!data) {
			return;
		}
		this.charts.cpvs_code_main.data = [];
		this.charts.cpvs_code_main_volume.data = [];
		this.sectors = [];
		if (data.sectors_stats) {
			data.sectors_stats.forEach((s) => {
				this.sectors.push(s.sector);
				this.charts.cpvs_code_main.data.push({name: s.sector.name, value: s.sector.value, id: s.sector.id});
				this.charts.cpvs_code_main_volume.data.push({name: s.sector.name, value: s.stats.sum_price['EUR'] || 0, id: s.sector.id});
			});
		}
		this.charts.cpvs_code_main.visible = this.charts.cpvs_code_main.data.length > 0;
		this.charts.cpvs_code_main_volume.visible = this.charts.cpvs_code_main_volume.data.length > 0;
	}

}
