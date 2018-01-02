import {Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy} from '@angular/core';
import {UrlId} from '../../utils/id.helper';
import {sortLinear, sortByTime, sortByDomain} from '../../utils/sort.helper';
import {toDate} from '../../utils/date.helper';
import {PlatformService} from '../../../../services/platform.service';
import {line, area, CurveFactory, Line, Area} from 'd3-shape';
import {ColorHelper} from '../../utils/color.helper';
import {IColorScaleType, IScaleType} from '../../chart.interface';

@Component({
	selector: 'g[ngx-charts-line-series]',
	template: `
		<svg:g>
			<defs>
				<svg:g ngx-charts-svg-linear-gradient ng-if="hasGradient" [color]="colors.getColor(data.name)" orientation="vertical" [name]="gradId.id" [stops]="gradientStops"/>
			</defs>
			<svg:g ngx-charts-area class="line-highlight"
				   [data]="data"
				   [path]="areaPath"
				   [fill]="hasGradient ? gradId.url : colors.getColor(data.name)"
				   [opacity]="0.25" [startOpacity]="0"
				   [gradient]="true" [stops]="areaGradientStops"
				   [class.active]="isActive(data)" [class.inactive]="isInactive(data)"
			/>
			<svg:g ngx-charts-line class="line-series"
				   [data]="data" [path]="path"
				   [stroke]="hasGradient ? gradId.url : colors.getColor(data.name)"
				   [class.active]="isActive(data)" [class.inactive]="isInactive(data)"/>
		</svg:g>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineSeriesComponent implements OnChanges {

	@Input() data;
	@Input() xScale;
	@Input() yScale;
	@Input() colors: ColorHelper;
	@Input() scaleType: IScaleType;
	@Input() curve: CurveFactory;
	@Input() activeEntries: any[];

	path: string;
	areaPath: string;
	gradId = new UrlId();
	hasGradient: boolean;
	gradientStops: any[];
	areaGradientStops: any[];

	constructor(private platform: PlatformService) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
	}

	update(): void {
		this.updateGradients();

		let _line = this.getLineGenerator();
		let _area = this.getAreaGenerator();

		let data = this.sortData(this.data.series);

		this.path = _line(data) || '';
		this.areaPath = _area(data) || '';
	}

	getLineGenerator(): Line<{ value: number, name: string }> {
		let result = line<{ value: number, name: string }>();
		return result
			.x(d => {
				let label = d.name;
				let value;
				if (this.scaleType === IScaleType.Time) {
					value = this.xScale(toDate(label));
				} else if (this.scaleType === IScaleType.Linear) {
					value = this.xScale(Number(label));
				} else {
					value = this.xScale(label);
				}
				return value;
			})
			.y(d => this.yScale(d.value))
			.curve(this.curve);
	}

	getAreaGenerator(): Area<{ value: number, name: string }> {
		let xProperty = (d) => {
			const label = d.name;
			return this.xScale(label);
		};

		return area<{ value: number, name: string }>()
			.x(xProperty)
			.y0(() => this.yScale.range()[0])
			.y1(d => this.yScale(d.value))
			.curve(this.curve);
	}

	sortData(data) {
		if (this.scaleType === IScaleType.Linear) {
			data = sortLinear(data, 'name');
		} else if (this.scaleType === IScaleType.Time) {
			data = sortByTime(data, 'name');
		} else {
			data = sortByDomain(data, 'name', 'asc', this.xScale.domain());
		}

		return data;
	}

	updateGradients() {
		if (this.colors.scaleType === IColorScaleType.Linear) {
			this.hasGradient = true;
			this.gradId.generate('grad', this.platform.isBrowser);
			let values = this.data.series.map(d => d.value);
			let max = Math.max(...values);
			let min = Math.min(...values);
			this.gradientStops = this.colors.getLinearGradientStops(max, min);
			this.areaGradientStops = this.colors.getLinearGradientStops(max);
		} else {
			this.hasGradient = false;
			this.gradientStops = undefined;
			this.areaGradientStops = undefined;
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
