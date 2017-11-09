import {
	Component,
	Input,
	ElementRef,
	OnChanges,
	SimpleChanges,
	ChangeDetectionStrategy,
} from '@angular/core';
import {PlatformService} from '../../../../services/platform.service';
import {select} from 'd3-selection';

@Component({
	selector: 'g[ngx-charts-axis-label]',
	template: `
		<svg:text
				[attr.stroke-width]="strokeWidth"
				[attr.text-anchor]="textAnchor"
				[attr.x]="x"
				[attr.y]="y"
				[attr.text-anchor]="textAnchor"
				[attr.transform]="transform">
			{{text}}
		</svg:text>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AxisLabelComponent implements OnChanges {

	@Input() orient: string;
	@Input() label: string;
	@Input() offset: number;
	@Input() width: number;
	@Input() height: number;

	x: number;
	y: number;
	transform: string;
	strokeWidth: string;
	textAnchor: string;
	textHeight: number = 25;
	margin: number = 5;
	text: string = '';

	constructor(private element: ElementRef, private platform: PlatformService) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.text = this.label;
		this.update();
		this.ellipseText();
	}

	update(): void {
		this.strokeWidth = '0.01';
		this.textAnchor = 'middle';
		this.transform = '';

		switch (this.orient) {
			case 'inline':
				this.y = this.offset;
				this.x = 0;
				this.textAnchor = 'left';
				break;
			case 'top':
				this.y = this.offset;
				this.x = this.width / 2;
				break;
			case 'bottom':
				this.y = this.offset;
				this.x = this.width / 2;
				break;
			case 'left-left':
				this.y = this.margin + this.offset;
				this.x = -this.height / 2;
				this.transform = 'rotate(270)';
				break;
			case 'left':
				this.y = -(this.offset + this.textHeight + this.margin);
				this.x = -this.height / 2;
				this.transform = 'rotate(270)';
				break;
			case 'right':
				this.y = this.offset + this.margin;
				this.x = -this.height / 2;
				this.transform = 'rotate(270)';
				break;
		}
	}

	ellipseText() {
		if (this.platform.isBrowser) {
			let self = select(this.element.nativeElement.firstElementChild);
			self.text(this.label);
			let textLength = self.node().getComputedTextLength(),
				text = this.label,
				padding = 0;
			while (textLength > (this.width - 2 * padding) && text.length > 0) {
				text = text.slice(0, -1);
				this.text = text + '…';
				self.text(this.text);
				textLength = self.node().getComputedTextLength();
			}
		} else {
			this.text = this.label;
		}
	}

}
