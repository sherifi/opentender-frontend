import {Component, Input, ElementRef, OnChanges, SimpleChanges, ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';
import {PlatformService} from '../../../../services/platform.service';
import {select} from 'd3-selection';
import {arc} from 'd3-shape';
import 'd3-transition';

@Component({
	selector: 'g[ngx-charts-pie-label]',
	template: `
		<title>{{label}}</title>
		<svg:text class="pie-label" dy=".35em"
				  [attr.transform]="transform"
				  [style.text-anchor]="textAnc"
				  [style.shape-rendering]="'crispEdges'">
			{{text}}
		</svg:text>
		<svg:path fill="none" class="line"
				  [attr.d]="line"
				  [attr.stroke]="color"
				  [style.stroke-dasharray]="2000"
				  [style.stroke-dashoffset]="0">
		</svg:path>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['pie-label.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PieLabelComponent implements OnChanges {

	@Input() data;
	@Input() radius;
	@Input() label;
	@Input() color;
	@Input() max;
	@Input() value;
	@Input() isLeft;
	@Input() explodeSlices;

	element: HTMLElement;
	labelXY: any;
	transform: string;
	line: string;
	textAnc: string = 'end';
	text: string;

	constructor(element: ElementRef, private platform: PlatformService) {
		this.element = element.nativeElement;
	}

	getLabel(label: string) {
		return label; // trimLabel(label, 20);
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
	}

	update(): void {
		const factor = 1.2;

		let outerArc = arc()
			.innerRadius(this.radius * factor)
			.outerRadius(this.radius * factor);

		let startRadius = this.radius;
		if (this.explodeSlices) {
			startRadius = this.radius * this.value / this.max;
		}

		let innerArc = arc()
			.innerRadius(startRadius)
			.outerRadius(startRadius);

		this.labelXY = outerArc.centroid(this.data);
		this.labelXY[0] = this.radius * factor * (this.isLeft ? 1 : -1);
		this.labelXY[1] = this.data.pos[1];

		this.line = `M${innerArc.centroid(this.data)}L${outerArc.centroid(this.data)}L${this.labelXY}`;
		this.transform = `translate(${this.labelXY})`;
		this.textAnc = this.textAnchor();
		this.text = this.getLabel(this.label);

		if (this.platform.isBrowser) {
			this.loadAnimation();
		}
	}

	textAnchor(): any {
		return this.isLeft ? 'start' : 'end';
	}

	midAngle(d): number {
		return d.startAngle + (d.endAngle - d.startAngle) / 2;
	}

	loadAnimation(): void {
		let label = select(this.element).select('.label');
		let line = select(this.element).select('.line');

		label
			.attr('opacity', 0)
			.transition().delay(750).duration(750)
			.attr('opacity', 1);

		line
			.style('stroke-dashoffset', 2000)
			.transition().delay(750).duration(750)
			.style('stroke-dashoffset', '0')
			.transition()
			.style('stroke-dasharray', 'none');
	}

}
