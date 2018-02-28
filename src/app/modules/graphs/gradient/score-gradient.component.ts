import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {UrlId} from '../../../thirdparty/ngx-charts-universal/utils/id.helper';
import {PlatformService} from '../../../services/platform.service';

@Component({
	selector: 'graph[score-gradient]',
	template: `
		<svg [attr.width]="width" [attr.height]="height">
			<defs>
				<linearGradient [id]="gradId.id" x1="0%" x2="100%" y1="0%" y2="0%">
					<stop offset="0" [attr.stop-color]="colorLow" stop-opacity="1"></stop>
					<stop offset="0.5" [attr.stop-color]="colorMid" stop-opacity="1"></stop>
					<stop offset="1" [attr.stop-color]="colorHigh" stop-opacity="1"></stop>
				</linearGradient>
			</defs>
			<rect [attr.fill]="gradId.url" [attr.x]="border" y="2" [attr.width]="width-4" [attr.height]="height-border"></rect>
			<rect stroke="#4a4a4a" fill="#4a4a4a" fill-opacity="0.8" [attr.x]="x-3" y="0" [attr.width]="6" [attr.height]="height"
				  ngx-tooltip
				  [tooltipPlacement]="'top'"
				  [tooltipType]="'tooltip'"
				  [tooltipTitle]="'Score: ' + value"
			></rect>
		</svg>
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
	colorLow: string = '#FF0000';
	@Input()
	colorMid: string = '#FFFF00';
	@Input()
	colorHigh: string = '#008000';
	gradId = new UrlId();

	x: number = 10;
	border: number = 4;

	constructor(private platform: PlatformService) {
		this.gradId.generate('grad', this.platform.isBrowser);
		this.resize();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.resize();
	}

	resize() {
		this.x = this.border + ((this.width - (this.border * 2)) * (this.value / 100));
	}

}
