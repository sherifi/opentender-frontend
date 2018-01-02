import {IChartPieSettings, IChartData} from '../chart.interface';
import {EventEmitter, Input, Output} from '@angular/core';
import {BaseChartComponent} from '../common/chart/base-chart.component';
import {ColorHelper} from '../utils/color.helper';
import {ViewDimensions} from '../utils/view-dimensions.helper';
import {IDomain} from '../common/common.interface';

export class BasePieChartComponent extends BaseChartComponent {
	@Input() data: Array<IChartData>;
	@Input() chart: IChartPieSettings;
	@Input() activeEntries: any[];
	@Output() select: EventEmitter<any>;
	@Output() activate: EventEmitter<any>;
	@Output() deactivate: EventEmitter<any>;

	colors: ColorHelper;
	domain: IDomain;
	viewDim: ViewDimensions;
	transform: string;
	margin = [20, 20, 20, 20];

	onClick(data): void {
		this.select.emit(data);
	}

	setColors(): void {
		this.colors = ColorHelper.fromColorSet(this.chart.colorScheme, this.domain);
	}

	getDomain(): any[] {
		return this.data.map(d => d.name);
	}
}
