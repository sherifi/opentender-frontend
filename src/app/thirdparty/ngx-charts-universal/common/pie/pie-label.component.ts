import {Component, Input, ElementRef, OnChanges, SimpleChanges, ChangeDetectionStrategy} from '@angular/core';
import {trimLabel} from '../../utils/label.helper';
import d3 from '../../d3';
import {PlatformService} from '../../../../services/platform.service';

@Component({
	selector: 'g[ngx-charts-pie-label]',
	template: `
    <title>{{label}}</title>
    <svg:text
      class="pie-label"
      [attr.transform]="transform"
      dy=".35em"
      [style.text-anchor]="textAnc"
      [style.shape-rendering]="'crispEdges'">
      {{text}}
    </svg:text>
    <svg:path
      [attr.d]="line"
      [attr.stroke]="color"
      fill="none"
      class="line"
      [style.stroke-dasharray]="2000"
      [style.stroke-dashoffset]="0">
    </svg:path>
  `,
	changeDetection: ChangeDetectionStrategy.OnPush,
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
	trimLabel: Function;
	labelXY: any;
	transform: string;
	line: string;
	textAnc: string = 'end';
	text: string;

	constructor(element: ElementRef, private platform: PlatformService) {
		this.element = element.nativeElement;
		this.trimLabel = trimLabel;
	}

	getLabel(label: string) {
		return trimLabel(label, 20);
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
	}

	update(): void {
		const factor = 1.2;

		let outerArc = d3.arc()
			.innerRadius(this.radius * factor)
			.outerRadius(this.radius * factor);

		let startRadius = this.radius;
		if (this.explodeSlices) {
			startRadius = this.radius * this.value / this.max;
		}

		let innerArc = d3.arc()
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
		let label = d3.select(this.element).select('.label');
		let line = d3.select(this.element).select('.line');

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
