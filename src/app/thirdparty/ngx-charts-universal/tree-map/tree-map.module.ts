import {NgModule} from '@angular/core';
import {ChartCommonModule} from '../common/chart/common-chart.module';
import {TreeMapComponent} from './tree-map.component';
import {CommonTreemapModule} from '../common/treemap/common-treemap.module';

export {TreeMapComponent};

const COMPONENTS = [TreeMapComponent];

@NgModule({
	imports: [ChartCommonModule, CommonTreemapModule],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class TreeMapModule {
}
