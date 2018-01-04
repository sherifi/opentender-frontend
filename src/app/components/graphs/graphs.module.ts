import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GraphScoreGradientComponent} from './score-gradient.component';
import {GraphIndicatorStructureComponent} from './indicator-structure.component';
import {GraphHistogramComponent} from './histogram.component';
import {GraphBenchmarksComponent} from './benchmarks.component';
import {GraphIndicatorSectorsComponent} from './indicator-sectors.component';
import {GraphIndicatorHistogramComponent} from './indicator-histogram.component';
import {GraphAuthoritiesComponent} from './authorities.component';
import {GraphBenchmarksDistributionComponent} from './benchmarks-distribution.component';
import {GraphProcedureTypesComponent} from './procedure-types.component';
import {GraphHomeHistogramComponent} from './home-histogram.component';
import {GraphIndicatorScoreHistogramComponent} from './score-histogram.component';
import {GraphCompaniesComponent} from './companies.component';
import {GraphSectorsComponent} from './sectors.component';
import {GraphScoreGridComponent} from './score-grid.component';
import {GraphScoreSectorsComponent} from './score-sectors.component';
import {GraphSectorTreemap} from './sector-treemap.component';
import {TreeMapModule} from '../../thirdparty/ngx-charts-universal/tree-map/tree-map.module';
import {HeatMapGridModule} from '../../thirdparty/ngx-charts-universal/heat-map-grid/heat-map-grid.module';
import {BarChartModule} from '../../thirdparty/ngx-charts-universal/bar-chart/bar-chart.module';
import {PieChartModule} from '../../thirdparty/ngx-charts-universal/pie-chart/pie-chart.module';
import {CommonTooltipModule} from '../../thirdparty/ngx-charts-universal/common/tooltip/common-tooltip.module';
import {FormsModule} from '@angular/forms';
import {DownloadSeriesModule} from '../download-series/download-series.module';
import {DialogModule} from '../dialog/dialog.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		TreeMapModule,
		PieChartModule,
		BarChartModule,
		HeatMapGridModule,
		DownloadSeriesModule,
		CommonTooltipModule
	],
	declarations: [
		GraphBenchmarksComponent,
		GraphBenchmarksDistributionComponent,
		GraphIndicatorHistogramComponent,
		GraphIndicatorSectorsComponent,
		GraphIndicatorStructureComponent,
		GraphSectorsComponent,
		GraphHistogramComponent,
		GraphAuthoritiesComponent,
		GraphCompaniesComponent,
		GraphProcedureTypesComponent,
		GraphHomeHistogramComponent,
		GraphIndicatorScoreHistogramComponent,
		GraphScoreGridComponent,
		GraphScoreSectorsComponent,
		GraphSectorTreemap,
		GraphScoreGradientComponent,
	],
	exports: [
		GraphBenchmarksComponent,
		GraphBenchmarksDistributionComponent,
		GraphIndicatorHistogramComponent,
		GraphIndicatorSectorsComponent,
		GraphIndicatorStructureComponent,
		GraphSectorsComponent,
		GraphHistogramComponent,
		GraphAuthoritiesComponent,
		GraphCompaniesComponent,
		GraphProcedureTypesComponent,
		GraphHomeHistogramComponent,
		GraphIndicatorScoreHistogramComponent,
		GraphScoreGridComponent,
		GraphScoreSectorsComponent,
		GraphSectorTreemap,
		GraphScoreGradientComponent,
	]
})
export class GraphModule {
}
