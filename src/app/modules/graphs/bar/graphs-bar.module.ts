import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DownloadSeriesModule} from '../../download-series/download-series.module';
import {CommonTooltipModule} from '../../../thirdparty/ngx-charts-universal/common/tooltip/common-tooltip.module';
import {GraphProcedureTypesComponent} from './procedure-types.component';
import {GraphHomeHistogramComponent} from './home-histogram.component';
import {GraphIndicatorScoreHistogramComponent} from './score-histogram.component';
import {GraphCompaniesComponent} from './companies.component';
import {GraphSectorsComponent} from './sectors.component';
import {GraphScoreSectorsComponent} from './score-sectors.component';
import {BarChartModule} from '../../../thirdparty/ngx-charts-universal/bar-chart/bar-chart.module';
import {GraphHistogramComponent} from './histogram.component';
import {GraphIndicatorSectorsComponent} from './indicator-sectors.component';
import {GraphIndicatorHistogramComponent} from './indicator-histogram.component';
import {GraphAuthoritiesComponent} from './authorities.component';

@NgModule({
	imports: [
		CommonModule,
		DownloadSeriesModule,
		BarChartModule,
		CommonTooltipModule
	],
	declarations: [
		GraphSectorsComponent,
		GraphCompaniesComponent,
		GraphProcedureTypesComponent,
		GraphHomeHistogramComponent,
		GraphIndicatorScoreHistogramComponent,
		GraphScoreSectorsComponent,
		GraphIndicatorHistogramComponent,
		GraphIndicatorSectorsComponent,
		GraphHistogramComponent,
		GraphAuthoritiesComponent
	],
	exports: [
		GraphSectorsComponent,
		GraphCompaniesComponent,
		GraphProcedureTypesComponent,
		GraphHomeHistogramComponent,
		GraphIndicatorScoreHistogramComponent,
		GraphScoreSectorsComponent,
		GraphIndicatorHistogramComponent,
		GraphIndicatorSectorsComponent,
		GraphHistogramComponent,
		GraphAuthoritiesComponent
	]
})
export class GraphsBarModule {
}
