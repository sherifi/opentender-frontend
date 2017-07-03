import {Component, ContentChild, ElementRef, HostListener, Input, TemplateRef, ViewChild, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {ChartComponent} from '../common/chart/chart.component';
import {BaseChartComponent} from '../common/chart/base-chart.component';
import {calculateViewDimensions, ViewDimensions} from '../utils/view-dimensions.helper';
import d3 from '../d3';
import {ColorHelper} from '../utils/color.helper';
import {IChartFlowChartSettings, IChartData, IChartLink, IChartNode} from '../chart.interface';
import {ILegendOptions} from '../common/common.interface';

@Component({
	selector: 'ngx-charts-force-directed-graph',
	template: `
		<ngx-charts-chart
				[dim]="dim" [chart]="chart" [data]="data"
				[legendOptions]="legendOptions"
				(legendLabelClick)="onClick($event)"
				(legendLabelActivate)="onActivate($event)"
				(legendLabelDeactivate)="onDeactivate($event)">
			<svg:g [attr.transform]="transform" class="force-directed-graph chart">
				<svg:g class="links">
					<svg:g *ngFor="let link of links; trackBy:trackLinkBy">
						<ng-template *ngIf="linkTemplate"
									 [ngTemplateOutlet]="linkTemplate"
									 [ngOutletContext]="{ $implicit: link }">
						</ng-template>
						<svg:line *ngIf="!linkTemplate"
								  strokeWidth="1" class="edge"
								  [attr.x1]="link.source.x"
								  [attr.y1]="link.source.y"
								  [attr.x2]="link.target.x"
								  [attr.y2]="link.target.y"
						/>
					</svg:g>
				</svg:g>
				<svg:g class="nodes">
					<svg:g *ngFor="let node of nodes; trackBy:trackNodeBy"
						   [attr.transform]="'translate(' + node.x + ',' + node.y + ')'"
						   [attr.fill]="colors.getColor(groupResultsBy(node))"
						   [attr.stroke]="colors.getColor(groupResultsBy(node))"
						   (mousedown)="onDragStart(node, $event)"
						   (click)="onClick({name: node.value})"
						   ngx-tooltip
						   [tooltipPlacement]="'top'"
						   [tooltipType]="'tooltip'"
						   [tooltipTitle]="node.value">
						<ng-template *ngIf="nodeTemplate"
									 [ngTemplateOutlet]="nodeTemplate"
									 [ngOutletContext]="{ $implicit: node }">
						</ng-template>
						<svg:circle *ngIf="!nodeTemplate" r="5"/>
					</svg:g>
				</svg:g>
			</svg:g>
		</ngx-charts-chart>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForceDirectedGraphComponent extends BaseChartComponent {
	@Input() chart: IChartFlowChartSettings;
	@Input() data: Array<IChartData>;
	@Input() activeEntries: any[];
	@Output() select: EventEmitter<any>;
	@Output() activate: EventEmitter<any>;
	@Output() deactivate: EventEmitter<any>;

	@Input() force = d3.forceSimulation()
		.force('charge', d3.forceManyBody())
		.force('collide', d3.forceCollide(5))
		.force('x', d3.forceX())
		.force('y', d3.forceY());

	@Input() forceLink = d3.forceLink<IChartNode, IChartLink>().id(node => node.value.toString());
	@Input() groupResultsBy: (node: any) => string = node => node.value;
	@Input() legend: boolean;

	@ContentChild('linkTemplate') linkTemplate: TemplateRef<any>;
	@ContentChild('nodeTemplate') nodeTemplate: TemplateRef<any>;
	@ViewChild(ChartComponent, {read: ElementRef}) chartRef: ElementRef;

	colors: ColorHelper;
	viewDim: ViewDimensions;
	draggingNode: any;
	draggingStart: { x: number, y: number };
	margin = [0, 0, 0, 0];
	seriesDomain: any;
	transform: string;
	legendOptions: any;

	update(): void {
		super.update();

		this.zone.run(() => {
			// center graph
			this.viewDim = calculateViewDimensions({
				width: this.dim.width,
				height: this.dim.height,
				margins: this.margin,
				showLegend: this.legend,
			});

			this.seriesDomain = this.getSeriesDomain();
			this.setColors();
			this.legendOptions = this.getLegendOptions();

			this.transform = `translate(${ this.viewDim.xOffset + this.viewDim.width / 2 }, ${ this.margin[0] + this.viewDim.height / 2 })`;
			if (this.force) {
				this.force.nodes(this.data)
					.force('link', this.forceLink.links(this.chart.links))
					.alpha(0.5).restart();
			}
		});
	}

	onClick(data, node): void {
		this.select.emit(data);
	}

	getSeriesDomain(): any[] {
		return this.data.map(d => this.groupResultsBy(d))
			.reduce((nodes: any[], node): any[] => nodes.includes(node) ? nodes : nodes.concat([node]), [])
			.sort();
	}

	trackLinkBy(index, link): any {
		return link.index;
	}

	trackNodeBy(index, node): any {
		return node.value;
	}

	setColors(): void {
		this.colors = new ColorHelper(this.chart.colorScheme, 'ordinal', this.seriesDomain, this.chart.customColors);
	}

	getLegendOptions(): ILegendOptions {
		return {
			scaleType: 'ordinal',
			domain: this.seriesDomain,
			colors: this.colors
		};
	}

	// Easier to use Angular2 event management than use d3.drag
	onDragStart(node, $event): void {
		this.force.alphaTarget(0.3).restart();
		this.draggingNode = node;
		this.draggingStart = {x: $event.x - node.x, y: $event.y - node.y};
		this.draggingNode.fx = $event.x - this.draggingStart.x;
		this.draggingNode.fy = $event.y - this.draggingStart.y;
	}

	@HostListener('document:mousemove', ['$event'])
	onDrag($event): void {
		if (!this.draggingNode) {
			return;
		}
		this.draggingNode.fx = $event.x - this.draggingStart.x;
		this.draggingNode.fy = $event.y - this.draggingStart.y;
	}

	@HostListener('document:mouseup')
	onDragEnd(node, $event): void {
		if (!this.draggingNode) {
			return;
		}

		this.force.alphaTarget(0);
		this.draggingNode.fx = undefined;
		this.draggingNode.fy = undefined;
		this.draggingNode = undefined;
	}
}
