import {Component, Input, Output, EventEmitter, ElementRef, OnChanges, SimpleChanges, ChangeDetectionStrategy, NgZone} from '@angular/core';
import {arc, pie} from 'd3-shape';
import {select} from 'd3-selection';
import {interpolate} from 'd3-interpolate';
import {PlatformService} from '../../../services/platform.service';

@Component({
	selector: 'g[ngx-charts-values-grid-series]',
	template: `
		<svg:g class="values-grid-arcs">
			<svg:path *ngFor="let arc of arcs"
					  [attr.class]="arc.class"
					  [attr.d]="arc.path"
					  [attr.fill]="arc.fill"
					  (select)="onClick($event)"
			/>
		</svg:g>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ValuesGridSeriesComponent implements OnChanges {

	@Input() data;
	@Input() innerRadius = 70;
	@Input() outerRadius = 80;
	@Input() cornerRadius = 0;

	@Output() select = new EventEmitter();

	element: HTMLElement;
	layout: any;
	arcs: Array<any> = [];
	initialized: boolean = false;

	constructor(element: ElementRef, protected platform: PlatformService) {
		this.element = element.nativeElement;
		this.layout = pie<{ data: { value: number } }>()
			.value((d) => {
				return d.data.value;
			}).sort(null);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.data) {
			this.arcs = this.getArcs();
			if (this.platform.isBrowser) {
				setTimeout(() => {
					if (this.initialized) {
						this.updateAnimation();
					} else {
						this.loadAnimation();
						this.initialized = true;
					}
				});
			}
		}
	}

	getArcs(): any[] {
		return this.layout(this.data).map((a, index) => {
			let other = a.data.data.other;
			if (index === 0) {
				a.startAngle = 0;
			}
			return {
				data: a.data.data,
				class: 'arc ' + 'arc' + index,
				fill: a.data.data.color,
				startAngle: other ? 0 : a.startAngle,
				endAngle: a.endAngle,
				path: this.calculateArc().startAngle(other ? 0 : a.startAngle).endAngle(a.endAngle)()
			};
		});
	}

	calculateArc(): any {
		return arc()
			.innerRadius(this.innerRadius)
			.outerRadius(this.outerRadius)
			.cornerRadius(this.cornerRadius);
	}

	onClick(data): void {
		this.select.emit({
			name: this.data[0].data.name,
			value: this.data[0].data.value
		});
	}

	label(a): string {
		return a.data.name;
	}

	loadAnimation(): void {
		let a = this.arcs[0];
		if (a.startAngle === a.endAngle) {
			return;
		}
		let node = select(this.element).selectAll('.arc0').data([{startAngle: a.startAngle, endAngle: a.endAngle}]);
		let ani_arc = this.calculateArc();
		node
			.transition()
			.attrTween('d', function(d) {
				this['_current'] = this['_current'] || d;
				let copyOfD = Object.assign({}, d);
				copyOfD.endAngle = copyOfD.startAngle;
				let interpol = interpolate(copyOfD, copyOfD);
				this['_current'] = interpol(0);
				return function(t) {
					return ani_arc(interpol(t));
				};
			})
			.transition().duration(750)
			.attrTween('d', function(d) {
				this['_current'] = this['_current'] || d;
				let interpol = interpolate(this['_current'], d);
				this['_current'] = interpol(0);
				return function(t) {
					return ani_arc(interpol(t));
				};
			});
	}

	updateAnimation(): void {
		let a = this.arcs[0];
		if (a.startAngle === a.endAngle) {
			return;
		}
		let node = select(this.element).selectAll('.arc0').data([{startAngle: a.startAngle, endAngle: a.endAngle}]);
		let ani_arc = this.calculateArc();
		node
			.transition().duration(750)
			.attrTween('d', function(d) {
				this['_current'] = this['_current'] || d;
				let interpol = interpolate(this['_current'], d);
				this['_current'] = interpol(0);
				return function(t) {
					return ani_arc(interpol(t));
				};
			});
	}
}
