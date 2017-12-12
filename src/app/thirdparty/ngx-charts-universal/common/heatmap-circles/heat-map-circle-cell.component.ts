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
					[attr.cx]="x+(width/2)"
					[attr.cy]="y+(height/2)"
					[attr.r]="(height*(data/100))/2"
					[attr.fill]="fill"
					[attr.stroke]="stroke"
					(click)="onClick()"></svg:circle>
		</svg:g>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeatMapCircleCellComponent implements OnChanges {

	@Input() fill: string;
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
