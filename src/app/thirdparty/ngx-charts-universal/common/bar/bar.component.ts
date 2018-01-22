import {Component, Input, Output, EventEmitter, HostListener, ElementRef, SimpleChanges, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import {UrlId} from '../../utils/id.helper';
import {PlatformService} from '../../../../services/platform.service';
import {roundedRect} from '../shapes/shapes.helper';
import {select} from 'd3-selection';
import 'd3-transition';

@Component({
	selector: 'g[ngx-charts-bar]',
	template: `
		<svg:defs *ngIf="hasGradient">
			<svg:g ngx-charts-svg-linear-gradient [color]="fill" [orientation]="orientation" [name]="gradId.id" [stops]="gradientStops"/>
		</svg:defs>
		<svg:path class="bar" stroke="none" [class.active]="isActive" [attr.d]="path" [attr.fill]="hasGradient ? gradId.url : fill" (click)="select.emit(data)"/>
		<svg:text *ngIf="replacement" [style.font-size]="'11px'" stroke="#818181" stroke-width="0.5" [attr.x]="x+3" [attr.y]="y+(width/2)+3" [attr.transform]="textTransform">{{replacement}}</svg:text>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarComponent implements OnChanges {
	@Input() fill;
	@Input() data;
	@Input() width;
	@Input() height;
	@Input() x;
	@Input() y;
	@Input() replacement: string;
	@Input() orientation;
	@Input() roundEdges: boolean = false;
	@Input() gradient: boolean = false;
	@Input() offset = 0;
	@Input() isActive: boolean = false;
	@Input() stops: any[];

	@Output() select = new EventEmitter();
	@Output() activate = new EventEmitter();
	@Output() deactivate = new EventEmitter();

	element: any;
	path: string;
	initialized: boolean = false;

	gradientStops: any[];
	gradId = new UrlId();
	hasGradient: boolean = false;
	textTransform: string;

	constructor(element: ElementRef, private platform: PlatformService) {
		this.element = element.nativeElement;
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.initialized = false;
		this.update();
	}

	update(): void {
		this.textTransform = 'translate(0,0) rotate(270,' + this.x + ',' + this.y + ')';
		this.gradId.generate('grad', this.platform.isBrowser);
		if (this.gradient && this.stops) {
			this.gradientStops = this.getGradient();
			this.hasGradient = true;
		} else {
			this.hasGradient = false;
		}
		this.path = this.getStartingPath();
		if (this.platform.isBrowser) {
			if (!this.initialized) {
				setTimeout(this.loadAnimation.bind(this), 0);
			} else {
				this.animateToCurrentForm();
			}
		} else {
			this.path = this.getPath();
		}
	}

	loadAnimation(): void {
		this.initialized = true;
		this.path = this.getStartingPath();
		setTimeout(this.update.bind(this), 100);
	}

	animateToCurrentForm(): void {
		if (!this.platform.isBrowser) {
			this.path = this.getPath();
		} else {
			let node = select(this.element).select('.bar');
			let path = this.getPath();
			node.transition().duration(250).attr('d', path);
		}
	}

	getGradient() {
		if (this.stops) {
			return this.stops;
		}
		return [
			{
				offset: 0,
				color: this.fill,
				opacity: this.getStartOpacity()
			},
			{
				offset: 100,
				color: this.fill,
				opacity: 1
			}];
	}

	getStartingPath() {
		let path;

		if (this.roundEdges) {
			if (this.orientation === 'vertical') {
				path = roundedRect(this.x, this.y + this.height, this.width, 1, 0, this.edges);
			} else if (this.orientation === 'horizontal') {
				path = roundedRect(this.x, this.y, 1, this.height, 0, this.edges);
			}
		} else {
			if (this.orientation === 'vertical') {
				path = roundedRect(this.x, this.y + this.height, this.width, 1, 0, this.edges);
			} else if (this.orientation === 'horizontal') {
				path = roundedRect(this.x, this.y, 1, this.height, 0, this.edges);
			}
		}

		return path;
	}

	get edges() {
		let edges = [false, false, false, false];
		if (this.roundEdges) {
			if (this.orientation === 'vertical') {
				if (this.data.value > 0) {
					edges = [true, true, false, false];
				} else {
					edges = [false, false, true, true];
				}
			} else if (this.orientation === 'horizontal') {
				if (this.data.value > 0) {
					edges = [false, true, false, true];
				} else {
					edges = [true, false, true, false];
				}
			}
		}
		return edges;
	}

	getPath() {
		let radius = this.getRadius();
		let path;

		if (this.roundEdges) {
			if (this.orientation === 'vertical') {
				radius = Math.min(this.height, radius);
				path = roundedRect(this.x, this.y, this.width, this.height, radius, this.edges);
			} else if (this.orientation === 'horizontal') {
				radius = Math.min(this.width, radius);
				path = roundedRect(this.x, this.y, this.width, this.height, radius, this.edges);
			}
		} else {
			path = roundedRect(this.x, this.y, this.width, this.height, radius, this.edges);
		}

		return path;
	}

	getRadius(): number {
		let radius = 0;

		if (this.roundEdges && this.height > 5 && this.width > 5) {
			radius = Math.floor(Math.min(5, this.height / 2, this.width / 2));
		}

		return radius;
	}

	getStartOpacity(): number {
		if (this.roundEdges) {
			return 0.2;
		} else {
			return 0.5;
		}
	}

	@HostListener('mouseenter')
	onMouseEnter(): void {
		this.activate.emit(this.data);
	}

	@HostListener('mouseleave')
	onMouseLeave(): void {
		this.deactivate.emit(this.data);
	}

}
