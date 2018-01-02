import {Component, Input, Output, EventEmitter, ElementRef, OnChanges, ChangeDetectionStrategy, NgZone, ChangeDetectorRef, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {UrlId} from '../../utils/id.helper';
import {IDomain} from '../common.interface';
import {ViewDimensions} from '../../utils/view-dimensions.helper';
import {toDate} from '../../utils/date.helper';
import {PlatformService} from '../../../../services/platform.service';
import {select, selection} from 'd3-selection';
import {scaleTime, scaleLinear, scalePoint} from 'd3-scale';
import {brushX} from 'd3-brush';
import {IScaleType} from '../../chart.interface';

@Component({
	selector: 'g[ngx-charts-timeline]',
	template: `
		<svg:g class="timeline" [attr.transform]="transform">
			<svg:filter [attr.id]="filterId.id">
				<svg:feColorMatrix in="SourceGraphic" type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"/>
			</svg:filter>
			<svg:g class="embedded-chart">
				<ng-content></ng-content>
			</svg:g>
			<svg:rect x="0" y="0" class="brush-background" [attr.width]="view[0]" [attr.height]="height"/>
			<svg:g class="brush"></svg:g>
		</svg:g>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['timeline.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TimelineComponent implements OnChanges {

	@Input() view;
	@Input() results;
	@Input() scheme;
	@Input() legend;
	// @Input() miniChart;
	// @Input() autoScale;
	@Input() scaleType: IScaleType;
	@Input() height = 50;

	@Output() select = new EventEmitter();
	@Output() onDomainChange = new EventEmitter();

	element: HTMLElement;
	dims: ViewDimensions;
	xDomain: IDomain;
	xScale;
	brush: any;
	transform: string;
	initialized = false;
	filterId = new UrlId();

	constructor(element: ElementRef, private zone: NgZone, private cd: ChangeDetectorRef, private platform: PlatformService) {
		this.element = element.nativeElement;
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.update();

		if (!this.initialized) {
			this.addBrush();
			this.initialized = true;
		}
	}

	update(): void {
		this.zone.run(() => {
			this.dims = this.getDims();
			this.height = this.dims.height;
			let offsetY = this.view[1] - this.height;

			this.xDomain = this.getXDomain();
			this.xScale = this.getXScale();

			if (this.brush) {
				this.updateBrush();
			}

			this.transform = `translate(0 , ${ offsetY })`;

			this.filterId.generate('filter', this.platform.isBrowser);

			this.cd.markForCheck();
		});
	}

	getXDomain(): IDomain {
		let values = [];

		for (let results of this.results) {
			for (let d of results.series) {
				if (values.indexOf(d.name) < 0) {
					values.push(d.name);
				}
			}
		}

		let domain = [];
		if (this.scaleType === IScaleType.Time) {
			values = values.map(v => toDate(v));
			let min = Math.min(...values);
			let max = Math.max(...values);
			domain = [min, max];
		} else if (this.scaleType === IScaleType.Linear) {
			values = values.map(v => Number(v));
			let min = Math.min(...values);
			let max = Math.max(...values);
			domain = [min, max];
		} else if (this.scaleType === IScaleType.Ordinal) {
			domain = values;
		}

		return domain;
	}

	getXScale() {
		let scale;
		let domain = this.xDomain.map(d => {
			return <number>d;
		});
		if (this.scaleType === IScaleType.Time) {
			scale = scaleTime()
				.range([0, this.dims.width])
				.domain(domain);
		} else if (this.scaleType === IScaleType.Linear) {
			scale = scaleLinear()
				.range([0, this.dims.width])
				.domain(domain);
		} else if (this.scaleType === IScaleType.Ordinal) {
			scale = scalePoint<number>()
				.range([0, this.dims.width])
				.padding(0.1)
				.domain(domain);
		}
		return scale;
	}

	addBrush(): void {
		if (this.brush) {
			return;
		}

		const height = this.height;
		const width = this.view[0];

		this.brush = brushX()
			.extent([[0, 0], [width, height]])
			.on('brush end', () => {
				this.zone.run(() => {
					const sel = /*selection.event.selection ||*/ this.xScale.range();
					const newDomain = sel.map(this.xScale.invert);

					this.onDomainChange.emit(newDomain);
					this.cd.markForCheck();
				});
			});

		select(this.element)
			.select('.brush')
			.call(this.brush);
	}

	updateBrush(): void {
		if (!this.brush) {
			return;
		}

		const height = this.height;
		const width = this.view[0];

		this.zone.run(() => {
			this.brush.extent([[0, 0], [width, height]]);
			select(this.element)
				.select('.brush')
				.call(this.brush);

			// clear hardcoded properties so they can be defined by CSS
			select(this.element).select('.selection')
				.attr('fill', undefined)
				.attr('stroke', undefined)
				.attr('fill-opacity', undefined);

			this.cd.markForCheck();
		});
	}

	getDims(): ViewDimensions {
		return {
			width: this.view[0],
			height: this.height,
			xOffset: 0
		};
	}

}
