import {Component, Input, Output, EventEmitter, SimpleChanges, ElementRef, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import {PlatformService} from '../../../../services/platform.service';
import {select} from 'd3-selection';
import 'd3-transition';

@Component({
	selector: 'g[ngx-charts-heat-map-circle-cell]',
	template: `
		<svg:g class="cell">
			<svg:circle *ngIf="data!==null"
					class="circle"
					[attr.cx]="x"
					[attr.cy]="y"
					[attr.r]="r"
					[attr.fill]="fill"
					[attr.stroke]="stroke"
					stroke-width="0.5"
					(click)="onClick()"></svg:circle>
		</svg:g>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeatMapCircleCellComponent implements OnChanges {

	@Input() stroke: string;
	@Input() fill: string;
	@Input() r: number;
	@Input() x: number;
	@Input() y: number;
	@Input() width: number;
	@Input() height: number;
	@Input() data: number;

	@Output() select = new EventEmitter();

	element: HTMLElement;
	transform: string;
	startOpacity: number;

	constructor(element: ElementRef, private platform: PlatformService) {
		this.element = element.nativeElement;
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
	}

	update() {
		this.startOpacity = 0.3;
		if (this.platform.isBrowser) {
			this.loadAnimation();
		}
	}

	loadAnimation(): void {
		let node = select(this.element).select('.cell');
		node.attr('opacity', 0);
		this.animateToCurrentForm();
	}

	animateToCurrentForm(): void {
		let node = select(this.element).select('.cell');

		node.transition().duration(750)
			.attr('opacity', 1);
	}

	onClick() {
		this.select.emit(this.data);
	}

}
