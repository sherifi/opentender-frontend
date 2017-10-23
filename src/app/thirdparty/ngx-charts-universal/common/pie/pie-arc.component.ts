import {Component, Input, Output, EventEmitter, ElementRef, SimpleChanges, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import {UrlId} from '../../utils/id.helper';
import {PlatformService} from '../../../../services/platform.service';
import {select} from 'd3-selection';
import {arc} from 'd3-shape';
import {interpolate} from 'd3-interpolate';
import 'd3-transition';

@Component({
	selector: 'g[ngx-charts-pie-arc]',
	template: `
		<svg:g class="arc-group">
			<svg:defs *ngIf="gradient">
				<svg:g ngx-charts-svg-radial-gradient
					   [color]="fill"
					   orientation="vertical"
					   [name]="gradId.id"
					   [startOpacity]="startOpacity"
				/>
			</svg:defs>
			<svg:path
					[attr.d]="path"
					class="arc"
					[class.active]="isActive"
					[attr.fill]="gradient ? gradId.url : fill"
					[attr.fill-opacity]="fill?1:0"
					[attr.stroke]="fill?fill:border"
					(click)="onClick()"
					(mouseenter)="activate.emit(data)"
					(mouseleave)="deactivate.emit(data)"
					[style.pointer-events]="pointerEvents ? 'auto' : 'none'"
			/>
		</svg:g>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieArcComponent implements OnChanges {

	@Input() fill: string;
	@Input() border: string;
	@Input() startAngle = 0;
	@Input() endAngle: number = Math.PI * 2;
	@Input() innerRadius;
	@Input() outerRadius;
	@Input() cornerRadius = 0;
	@Input() value;
	@Input() max;
	@Input() data;
	@Input() explodeSlices = false;
	@Input() gradient = false;
	@Input() animate = true;
	@Input() pointerEvents = true;
	@Input() isActive = false;

	@Output() select = new EventEmitter();
	@Output() activate = new EventEmitter();
	@Output() deactivate = new EventEmitter();

	element: HTMLElement;
	path: any;
	startOpacity: number;
	gradId = new UrlId();
	initialized = false;

	constructor(element: ElementRef, private platform: PlatformService) {
		this.element = element.nativeElement;
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
	}

	update(): void {
		this.path = this.calculateArc().startAngle(this.startAngle).endAngle(this.endAngle)();
		this.startOpacity = 0.5;
		this.gradId.generate('linearGrad', this.platform.isBrowser);
		if (this.platform.isBrowser) {
			if (this.animate) {
				if (this.initialized) {
					this.updateAnimation();
				} else {
					this.loadAnimation();
					this.initialized = true;
				}
			}
		}
	}

	calculateArc(): any {
		let outerRadius = this.outerRadius;
		if (this.explodeSlices && this.innerRadius === 0) {
			outerRadius = this.outerRadius * this.value / this.max;
		}
		return arc()
			.innerRadius(this.innerRadius)
			.outerRadius(outerRadius)
			.cornerRadius(this.cornerRadius);
	}

	loadAnimation(): void {
		let node = select(this.element).selectAll('.arc').data([{startAngle: this.startAngle, endAngle: this.endAngle}]);
		let a = this.calculateArc();
		node
			.transition()
			.attrTween('d', function(d) {
				this['_current'] = this['_current'] || d;
				let copyOfD = Object.assign({}, d);
				copyOfD.endAngle = copyOfD.startAngle;
				let interpol = interpolate(copyOfD, copyOfD);
				this['_current'] = interpol(0);
				return function(t) {
					return a(interpol(t));
				};
			})
			.transition().duration(750)
			.attrTween('d', function(d) {
				this['_current'] = this['_current'] || d;
				let interpol = interpolate(this['_current'], d);
				this['_current'] = interpol(0);
				return function(t) {
					return a(interpol(t));
				};
			});
	}

	updateAnimation(): void {
		let node = select(this.element).selectAll('.arc').data([{startAngle: this.startAngle, endAngle: this.endAngle}]);
		let a = this.calculateArc();
		node
			.transition().duration(750)
			.attrTween('d', function(d) {
				this['_current'] = this['_current'] || d;
				let interpol = interpolate(this['_current'], d);
				this['_current'] = interpol(0);
				return function(t) {
					return a(interpol(t));
				};
			});
	}

	onClick(): void {
		this.select.emit(this.data);
	}

}
