import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
	selector: 'graph[score-gradient]',
	template: `
		<!--<span>{{valueLow | formatNumber}}</span>-->
		<svg [attr.width]="width" [attr.height]="height">
			<defs>
				<linearGradient id="legendGradient" x1="0%" x2="100%" y1="0%" y2="0%">
					<stop offset="0" [attr.stop-color]="colorLow" stop-opacity="1"></stop>
					<stop offset="0.5" [attr.stop-color]="colorMid" stop-opacity="1"></stop>
					<stop offset="1" [attr.stop-color]="colorHigh" stop-opacity="1"></stop>
				</linearGradient>
			</defs>
			<rect fill="url(#legendGradient)" [attr.x]="border" y="2" [attr.width]="width-4" [attr.height]="height-border"></rect>
			<rect stroke="gray" fill="gray" fill-opacity="0.8" [attr.x]="x-3" y="0" [attr.width]="6" [attr.height]="height"
				  ngx-tooltip
				  [tooltipPlacement]="'top'"
				  [tooltipType]="'tooltip'"
				  [tooltipTitle]="'Score: ' + value"
			></rect>
		</svg>
		<!--<span>{{valueHigh | formatNumber}}</span>-->
	`
})
export class GraphScoreGradientComponent implements OnChanges {
	@Input()
	value: number = 100;
	@Input()
	valueLow: number = 0;
	@Input()
	valueHigh: number = 100;
	@Input()
	width: number = 60;
	@Input()
	height: number = 16;
	@Input()
	colorLow: string = 'red';
	@Input()
	colorMid: string = 'yellow';
	@Input()
	colorHigh: string = 'green';

	x: number = 10;
	border: number = 4;

	constructor() {
		this.resize();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.resize();
	}

	resize() {
		this.x = this.border + ((this.width - (this.border * 2)) * (this.value / 100));
	}

}
