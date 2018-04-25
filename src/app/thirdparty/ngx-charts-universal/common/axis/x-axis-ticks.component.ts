import {Component, Input, Output, EventEmitter, OnChanges, ElementRef, ViewChild, SimpleChanges, AfterViewInit, ChangeDetectionStrategy} from '@angular/core';
import {isDate} from '../../utils/date.helper';
import {reduceTicks} from './ticks.helper';
import {PlatformService} from '../../../../services/platform.service';

@Component({
	selector: 'g[ngx-charts-x-axis-ticks]',
	template: `
		<svg:g #ticksel>
			<svg:g *ngFor="let tick of ticks" class="tick" [attr.transform]="tickTransform(tick)">
				<title>{{tickFormat(tick)}}</title>
				<svg:text stroke-width="0.01" [attr.text-anchor]="textAnchor" [attr.transform]="textTransform" [style.font-size]="'11px'">{{tickFormat(tick)}}</svg:text>
			</svg:g>
		</svg:g>
		<svg:g *ngFor="let tick of ticks" [attr.transform]="tickTransform(tick)">
			<svg:g *ngIf="showGridLines" [attr.transform]="gridLineTransform()">
				<svg:line class="gridline-path gridline-path-vertical" [attr.y1]="-gridLineHeight" y2="0"/>
			</svg:g>
		</svg:g>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class XAxisTicksComponent implements OnChanges, AfterViewInit {

	@Input() scale;
	@Input() defaultHeight: number;
	@Input() orient;
	@Input() tickArguments = [5];
	@Input() tickStroke = '#ccc';
	@Input() tickFormatting;
	@Input() showGridLines = false;
	@Input() gridLineHeight;
	@Input() width;
	@Input() minInterval: number;

	@Output() dimensionsChanged = new EventEmitter();

	verticalSpacing: number = 10;
	rotateLabels: boolean = false;
	innerTickSize: number = 6;
	outerTickSize: number = 6;
	tickPadding: number = 3;
	textAnchor: string = 'middle';
	maxTicksLength: number = 0;
	maxAllowedLength: number = 16;
	tickValues: any;
	textTransform: string = '';
	ticks: any;
	tickFormat: (tick: string|Date) => string;
	height: number = 0;
	adjustedScale = (d) => { return 0; };

	@ViewChild('ticksel') ticksElement: ElementRef;

	constructor(private platform: PlatformService) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
	}

	ngAfterViewInit(): void {
		if (this.platform.isBrowser) {
			setTimeout(() => this.updateDims());
		} else {
			this.updateDims();
		}
	}

	updateDims(): void {
		const height = this.platform.isBrowser ? parseInt(this.ticksElement.nativeElement.getBoundingClientRect().height, 10) : this.defaultHeight;
		if (height !== this.height) {
			this.height = height;
			this.dimensionsChanged.emit({height});
			if (this.platform.isBrowser) {
				setTimeout(() => this.updateDims());
			}
		}
	}

	update(): void {
		if (!this.scale) {
			return;
		}
		this.ticks = this.getTicks();
		if (this.tickFormatting) {
			this.tickFormat = this.tickFormatting;
		} else if (this.scale.tickFormat) {
			this.tickFormat = this.scale.tickFormat.apply(this.scale, this.tickArguments);
		} else {
			this.tickFormat = d => isDate(d) ? (<Date>d).toLocaleDateString() : (<string>d).toLocaleString();
		}
		this.maxTicksLength = 0;

		let angle = this.getRotationAngle(this.ticks);

		this.adjustedScale = this.scale.bandwidth ? function(d) {
			return this.scale(d) + this.scale.bandwidth() * 0.5;
		} : this.scale;

		if (angle !== 0) {
			this.textTransform = `rotate(${angle})`;
			this.textAnchor = 'end';
			this.verticalSpacing = 5;
		} else {
			this.textTransform = '';
			this.textAnchor = 'middle';
			this.verticalSpacing = 10;
		}
		setTimeout(() => this.updateDims());
	}

	getRotationAngle(ticks): number {
		let angle = 0;
		for (let i = 0; i < ticks.length; i++) {
			let tick = ticks[i].toString();
			if (tick.length > this.maxTicksLength) {
				this.maxTicksLength = tick.length;
			}
		}

		let len = Math.min(this.maxTicksLength, this.maxAllowedLength);
		let charWidth = 8; // need to measure this
		let wordWidth = len * charWidth;

		let baseWidth = wordWidth;
		let maxBaseWidth = Math.floor(this.width / ticks.length);

		// calculate optimal angle
		while (baseWidth > maxBaseWidth && angle > -90) {
			angle -= 30;
			baseWidth = Math.cos(angle * (Math.PI / 180)) * wordWidth;
		}

		return angle;
	}

	getTicks() {
		let ticks = [];
		let maxTicks = this.getMaxTicks();
		if (this.tickValues) {
			ticks = this.tickValues;
		} else if (this.scale) {
			if (this.scale.ticks) {
				ticks = this.scale.ticks.apply(this.scale, this.tickArguments);
				if (this.minInterval && ticks.length > 1) {
					let tickInterval = ticks[1] - ticks[0];
					let tickcount = this.tickArguments ? this.tickArguments[0] : maxTicks;
					tickcount--;
					while (tickInterval > 0 && tickInterval < this.minInterval) {
						ticks = this.scale.ticks.apply(this.scale, [tickcount]);
						if (ticks.length < 2) {
							tickInterval = this.minInterval;
						} else {
							tickInterval = ticks[1] - ticks[0];
						}
						tickcount--;
					}
				}
				if (ticks.length > maxTicks) {
					if (this.tickArguments) {
						this.tickArguments[0] = Math.min(this.tickArguments[0], maxTicks);
					} else {
						this.tickArguments = [maxTicks];
					}
					ticks = this.scale.ticks.apply(this.scale, this.tickArguments);
				}
			} else {
				ticks = this.scale.domain();
				ticks = reduceTicks(ticks, maxTicks);
			}
		}
		return ticks;
	}

	getMaxTicks(): number {
		let tickWidth = 20;
		return Math.floor(this.width / tickWidth);
	}

	tickTransform(tick): string {
		return 'translate(' + this.adjustedScale(tick) + ',' + this.verticalSpacing + ')';
	}

	gridLineTransform(): string {
		return `translate(0,${-this.verticalSpacing - 5})`;
	}

}
