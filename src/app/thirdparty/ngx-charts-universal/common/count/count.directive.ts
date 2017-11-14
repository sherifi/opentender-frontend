import {Component, Input, Output, EventEmitter, ChangeDetectorRef, NgZone, OnDestroy, ElementRef} from '@angular/core';
import {count, decimalChecker} from './count.helper';
import {PlatformService} from '../../../../services/platform.service';

/**
 * Count up component
 *
 * Loosely inspired by:
 *  - https://github.com/izupet/angular2-counto
 *  - https://inorganik.github.io/countUp.js/
 *
 * @export
 * @class CountUpDirective
 */
@Component({
	selector: '[ngx-charts-count-up]',
	template: `{{value}}`
})
export class CountUpDirective implements OnDestroy {

	@Input() countDuration = 1;
	@Input() countPrefix = '';
	@Input() countSuffix = '';
	@Input() formatCountUpNumber: (n: number) => string;

	@Input()
	set countDecimals(val: number) {
		this._countDecimals = val;
	}

	get countDecimals(): number {
		if (this._countDecimals) {
			return this._countDecimals;
		}
		return decimalChecker(this.countTo);
	}

	@Input()
	set countTo(val) {
		this._countTo = parseFloat(val);
		this.start();
	}

	get countTo(): any {
		return this._countTo;
	}

	@Input()
	set countFrom(val) {
		this._countFrom = parseFloat(val);
		this.start();
	}

	get countFrom(): any {
		return this._countFrom;
	}

	@Output() countChange = new EventEmitter();
	@Output() countFinish = new EventEmitter();

	private nativeElement: any;

	public value: string = '';

	private animationReq: any;

	private _countDecimals = 0;
	private _countTo = 0;
	private _countFrom = 0;

	constructor(private cd: ChangeDetectorRef, private zone: NgZone, element: ElementRef, private platform: PlatformService) {
		this.nativeElement = element.nativeElement;
	}

	_formatNumber(n: number): string {
		if (this.formatCountUpNumber) {
			return this.formatCountUpNumber(n);
		}
		return n.toString();
	}

	ngOnDestroy(): void {
		if (this.platform.isBrowser) {
			cancelAnimationFrame(this.animationReq);
		}
	}

	start(): void {
		if (!this.platform.isBrowser) {
			this.value = this._formatNumber(this._countTo);
			return;
		}
		cancelAnimationFrame(this.animationReq);

		const callback = ({value, progress, finished}) => {
			this.zone.run(() => {
				this.value = `${this.countPrefix}${this._formatNumber(value)}${this.countSuffix}`;
				this.cd.markForCheck();

				if (!finished) {
					this.countChange.emit({value, progress});
				}
				if (finished) {
					this.countFinish.emit({value, progress});
				}
			});
		};

		this.animationReq = count(
			this.countFrom,
			this.countTo,
			this.countDecimals,
			this.countDuration,
			callback);
	}

}
