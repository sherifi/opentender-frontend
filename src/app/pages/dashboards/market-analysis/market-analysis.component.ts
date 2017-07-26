import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {IChartTreeMap} from '../../../thirdparty/ngx-charts-universal/chart.interface';
import {ISector, IStats} from '../../../app.interfaces';
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
	public sectors: Array<ISector>;

	private charts: {
		cpvs_code_main: IChartTreeMap;
		cpvs_code_main_volume: IChartTreeMap;
	} = {
		cpvs_code_main: {
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
				valueFormatting: Utils.formatValue
			},
			select: (event) => {
				this.router.navigate(['/sector/' + event.id]);
			},
			data: null
		},
		cpvs_code_main_volume: {
			chart: {
				schemeType: 'ordinal',
				view: {
					def: {width: 964, height: 400},
					min: {height: 400},
					max: {height: 400}
				},
				colorScheme: {
					'domain': Consts.colors.diverging
				},
				valueFormatting: (n: number): string => {
					return '€ ' + Utils.formatValue(n);
				}
			},
			select: (event) => {
				this.router.navigate(['/sector/' + event.id]);
			},
			data: null
		}
	};

	constructor(private api: ApiService, private router: Router) {
	}

	public ngOnInit(): void {
		this.api.getMarketAnalysisStats({}).subscribe(
			(result) => {
				this.display(result.data);
			},
			(error) => {
				this.error = error._body;
				// console.error(error);
			},
			() => {
				// console.log('sector complete');
			});
	}

	public ngOnDestroy(): void {
	}

	display(data: IStats): void {
		this.charts.cpvs_code_main.data = null;
		this.charts.cpvs_code_main_volume.data = null;
		this.sectors = [];
		if (data && data.sectors_stats) {
			this.charts.cpvs_code_main.data = data.sectors_stats.map(s => {
				return {name: s.sector.name, value: s.sector.value, id: s.sector.id};
			});
			this.charts.cpvs_code_main_volume.data = data.sectors_stats.map(s => {
				return {name: s.sector.name, value: s.stats.sums_finalPrice['EUR'] || 0, id: s.sector.id};
			});
			this.sectors = data.sectors_stats.map(s => {
				return s.sector;
			});
		}
	}

}
