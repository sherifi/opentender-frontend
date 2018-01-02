import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy} from '@angular/core';
import {sortLinear, sortByTime, sortByDomain} from '../../utils/sort.helper';
import {area} from 'd3-shape';
import {ColorHelper} from '../../utils/color.helper';
import {IColorScaleType} from '../../chart.interface';

@Component({
	selector: 'g[ngx-charts-area-series]',
	template: `
    <svg:g ngx-charts-area
      class="area-series"
      [data]="data"
      [path]="path"
      [fill]="colors.getColor(data.name)"
      [stops]="gradientStops"
      [startingPath]="startingPath"
      [opacity]="opacity"
      [gradient]="gradient || hasGradient"
      [class.active]="isActive(data)"
      [class.inactive]="isInactive(data)"
    />
  `,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaSeriesComponent implements OnChanges {

	@Input() data;
	@Input() xScale;
	@Input() yScale;
	@Input() colors: ColorHelper;
	@Input() scaleType;
	@Input() stacked = false;
	@Input() normalized = false;
	@Input() gradient;
	@Input() curve;
	@Input() activeEntries: any[];

	@Output() select = new EventEmitter();

	opacity: number;
	path: string;
	startingPath: string;

	hasGradient: boolean;
	gradientStops: any[];

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
	}

	update(): void {
		this.updateGradient();

		let _area;
		let startingArea;

		let xProperty = (d) => {
			const label = d.name;
			return this.xScale(label);
		};

		if (this.stacked || this.normalized) {
			_area = area<{d0: number, d1: number}>()
				.x(xProperty)
				.y0((d, i) => this.yScale(d.d0))
				.y1((d, i) => this.yScale(d.d1));

			startingArea = area()
				.x(xProperty)
				.y0(d => this.yScale.range()[0])
				.y1(d => this.yScale.range()[0]);
		} else {
			_area = area<{value: number}>()
				.x(xProperty)
				.y0(() => this.yScale.range()[0])
				.y1(d => this.yScale(d.value));

			startingArea = area()
				.x(xProperty)
				.y0(d => this.yScale.range()[0])
				.y1(d => this.yScale.range()[0]);
		}

		_area.curve(this.curve);
		startingArea.curve(this.curve);

		this.opacity = .8;

		let data = this.data.series;
		if (this.scaleType === 'linear') {
			data = sortLinear(data, 'name');
		} else if (this.scaleType === 'time') {
			data = sortByTime(data, 'name');
		} else {
			data = sortByDomain(data, 'name', 'asc', this.xScale.domain());
		}

		this.path = _area(data);
		this.startingPath = startingArea(data);
	}

	updateGradient() {
		if (this.colors.scaleType === IColorScaleType.Linear) {
			this.hasGradient = true;
			if (this.stacked || this.normalized) {
				let d0values = this.data.series.map(d => d.d0);
				let d1values = this.data.series.map(d => d.d1);
				let max = Math.max(...d1values);
				let min = Math.min(...d0values);
				this.gradientStops = this.colors.getLinearGradientStops(max, min);
			} else {
				let values = this.data.series.map(d => d.value);
				let max = Math.max(...values);
				this.gradientStops = this.colors.getLinearGradientStops(max);
			}
		} else {
			this.hasGradient = false;
			this.gradientStops = undefined;
		}
	}

	isActive(entry): boolean {
		if (!this.activeEntries) {
			return false;
		}
		let item = this.activeEntries.find(d => {
			return entry.name === d.name;
		});
		return item !== undefined;
	}

	isInactive(entry): boolean {
		if (!this.activeEntries || this.activeEntries.length === 0) {
			return false;
		}
		let item = this.activeEntries.find(d => {
			return entry.name === d.name;
		});
		return item === undefined;
	}

}
