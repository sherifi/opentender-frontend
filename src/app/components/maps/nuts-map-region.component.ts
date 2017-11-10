import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IStatsNuts} from '../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'graph[region-nutsmap]',
	template: `
		<div class="graph-title" i18n>Region</div>
		<graph nutsmap [data]="map_data" [level]="level" [hideLegend]="true" [formatTooltip]="formatMapTooltip"></graph>
	`
})
export class MapRegionComponent implements OnChanges {
	@Input()
	data: string;
	@Input()
	level: number = 2;

	public map_data: IStatsNuts = null;

	constructor() {

	}

	ngOnChanges(changes: SimpleChanges): void {
		if (this.data) {
			this.map_data = {};
			this.map_data[this.data] = 0;
		}
	}

	formatMapTooltip(featureProperties: any): string {
		return featureProperties.name;
	}

}
