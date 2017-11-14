import {Component, Input, Output, EventEmitter, SimpleChanges, ElementRef, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import {UrlId} from '../../utils/id.helper';
import {PlatformService} from '../../../../services/platform.service';
import {select} from 'd3-selection';
import 'd3-transition';

@Component({
	selector: 'g[ngx-charts-heat-map-cell]',
	template: `
		<svg:g [attr.transform]="transform" class="cell">
			<defs *ngIf="gradient">
				<svg:g ngx-charts-svg-linear-gradient
					   [color]="fill"
					   orientation="vertical"
					   [name]="gradId.id"
					   [stops]="gradientStops"
				/>
			</defs>
			<svg:rect
					[attr.fill]="gradient ? gradId.url : fill"
					rx="3"
					[attr.width]="width"
					[attr.height]="height"
					class="cell"
					style="cursor: pointer"
					(click)="onClick()"
			/>
		</svg:g>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeatMapCellComponent implements OnChanges {

	@Input() fill;
	@Input() x;
	@Input() y;
	@Input() width;
	@Input() height;
	@Input() data;
	@Input() label;
	@Input() gradient = false;

	@Output() select = new EventEmitter();

	element: HTMLElement;
	transform: string;
	startOpacity: number;
	gradientStops: any[];
	gradId = new UrlId();

	constructor(element: ElementRef, private platform: PlatformService) {
		this.element = element.nativeElement;
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
	}

	update() {
		this.transform = `translate(${this.x} , ${this.y})`;
		this.startOpacity = 0.3;
		this.gradId.generate('grad', this.platform.isBrowser);
		this.gradientStops = this.getGradientStops();
		this.loadAnimation();
	}

	getGradientStops() {
		return [
			{
				offset: 0,
				color: this.fill,
				opacity: this.startOpacity
			},
			{
				offset: 100,
				color: this.fill,
				opacity: 1
			}];
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
