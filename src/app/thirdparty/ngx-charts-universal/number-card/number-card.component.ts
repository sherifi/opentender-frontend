import {Component, ChangeDetectionStrategy} from '@angular/core';
import {BaseChartComponent} from '../common/chart/base-chart.component';
import {calculateViewDimensions, ViewDimensions} from '../utils/view-dimensions.helper';
import {gridLayout} from '../utils/grid.helper';
import {ColorHelper} from '../utils/color.helper';

@Component({
	selector: 'ngx-charts-number-card',
	template: `
    <ngx-charts-chart [dim]="dim" [chart]="chart" [data]="data">
      <svg:g [attr.transform]="transform" class="number-card chart">
        <svg:g ngx-charts-card-series
          [colors]="colors"
          [data]="carddata"
          [dims]="viewDim"
          (select)="onClick($event)"
        />
      </svg:g>
    </ngx-charts-chart>
  `,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberCardComponent extends BaseChartComponent {

	viewDim: ViewDimensions;
	carddata: any[];
	colors: ColorHelper;
	transform: string;
	domain: any[];
	margin = [10, 10, 10, 10];

	update(): void {
		super.update();

		this.zone.run(() => {
			this.viewDim = calculateViewDimensions({
				width: this.dim.width,
				height: this.dim.height,
				margins: this.margin
			});

			this.domain = this.getDomain();

			this.carddata = gridLayout(this.viewDim, this.data, 150);

			this.setColors();
			this.transform = `translate(${ this.viewDim.xOffset } , ${ this.margin[0] })`;
		});
	}

	getDomain(): any[] {
		return this.data.map(d => d.name);
	}

	onClick(data): void {
		this.select.emit(data);
	}

	setColors(): void {
		this.colors = ColorHelper.fromColorSet(this.chart.colorScheme, this.domain);
	}

}
