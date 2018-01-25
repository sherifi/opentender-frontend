import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, ElementRef, ViewEncapsulation} from '@angular/core';
import {BaseChartComponent, PlatformService} from '../common/chart/base-chart.component';
import {calculateViewDimensions, ViewDimensions} from '../utils/view-dimensions.helper';
import {ColorHelper} from '../utils/color.helper';
import {IChartBaseSettings, IChartData} from '../chart.interface';
import {treemap, stratify} from 'd3-hierarchy';

@Component({
	selector: 'ngx-charts-tree-map',
	template: `
		<ngx-charts-chart [dim]="dim" [chart]="chart" [data]="data" [activeEntries]="activeEntries" [clickable]="clickable">
			<svg:g [attr.transform]="transform" class="tree-map chart">
				<svg:g ngx-charts-tree-map-cell-series
					   [colors]="colors"
					   [node]="node"
					   [dims]="viewDim"
					   [formatSeriesNumber]="chart.valueFormatting"
					   (select)="onClick($event)"
				/>
			</svg:g>
		</ngx-charts-chart>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['tree-map.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TreeMapComponent extends BaseChartComponent {
	@Input() chart: IChartBaseSettings;
	@Input() data: Array<IChartData>;
	@Input() activeEntries: any[];
	@Output() select: EventEmitter<any>;
	@Output() activate: EventEmitter<any>;
	@Output() deactivate: EventEmitter<any>;

	viewDim: ViewDimensions;
	transform: string;
	domain: any;
	colors: ColorHelper;
	node: any;
	margin = [0, 0, 0, 0];

	constructor(protected chartElement: ElementRef, protected zone: NgZone, protected cd: ChangeDetectorRef, protected platform: PlatformService) {
		super(chartElement, zone, cd, platform);
	}

	update(): void {
		super.update();
		this.zone.run(() => {

			this.viewDim = calculateViewDimensions({
				width: this.dim.width,
				height: this.dim.height,
				margins: this.margin
			});

			if (!this.data) {
				return;
			}

			let tmap = treemap<{ name: string, value: number, valueId: string, isRoot?: boolean }>()
				.size([this.viewDim.width, this.viewDim.height]);

			let rootNode = {
				name: 'root',
				value: 0,
				valueId: 'root',
				isRoot: true
			};
			let nodes = [rootNode];
			this.data.forEach(d => {
				nodes.push({
					name: d.name.toString(),
					value: d.value,
					valueId: d.id,
					isRoot: false
				});
			});

			let root = stratify<{ name: string, value: number, valueId: string, isRoot?: boolean }>()
				.id(d => {
					return d.name;
				})
				.parentId(d => {
					return d.isRoot ? null : 'root';
				})
				(nodes)
				.sum(d => d.value);

			this.node = tmap(root);

			this.domain = this.getDomain();

			this.setColors();

			this.transform = `translate(${ this.viewDim.xOffset } , ${ this.margin[0] })`;
		});
	}

	getDomain(): any[] {
		return this.data ? this.data.map(d => d.id || d.name) : [];
	}

	onClick(data): void {
		this.select.emit(data);
	}

	setColors(): void {
		this.colors = ColorHelper.fromColorSet(this.chart.colorScheme, this.domain);
	}
}
