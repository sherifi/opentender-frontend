import {ElementRef, NgZone, ChangeDetectorRef, Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import {Observable, Subscription} from 'rxjs/Rx';
import {IChartBaseSettings, IChartDimension, IChartData} from '../../chart.interface';
import {cloneData} from '../../utils/data.helper';
import {PlatformService} from '../../../../services/platform.service';

export {PlatformService};

@Component({
	selector: 'base-chart',
	template: ``
})
export class BaseChartComponent implements OnChanges, AfterViewInit, OnDestroy {
	@Input() chart: IChartBaseSettings;
	@Input() data: Array<IChartData>;
	@Input() activeEntries: any[] = [];
	@Output() select = new EventEmitter();
	@Output() activate: EventEmitter<any> = new EventEmitter();
	@Output() deactivate: EventEmitter<any> = new EventEmitter();

	public dim: IChartDimension;
	public lastdim: IChartDimension;
	public clickable: boolean = false;
	private resizeSubscription: Subscription;


	constructor(protected chartElement: ElementRef, protected zone: NgZone, protected cd: ChangeDetectorRef, protected platform: PlatformService) {
	}

	ngAfterViewInit(): void {
		if (this.platform.isBrowser) {
			this.bindWindowResizeEvent();
		}
	}

	ngOnDestroy(): void {
		if (this.platform.isBrowser) {
			this.unbindEvents();
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
		this.clickable = this.select.observers.length > 0;
	}

	update(): void {
		if (!this.chart) {
			return;
		}

		if (this.data) {
			this.data = cloneData(this.data);
		}
		if (this.chart.view.fixed) {
			this.dim = this.chart.view.fixed;
		} else {
			this.dim = this.getContainerDims();
		}
		if (this.chart.view.min) {
			if (this.chart.view.min.hasOwnProperty('width')) {
				this.dim.width = Math.max(this.chart.view.min.width, this.dim.width);
			}
			if (this.chart.view.min.hasOwnProperty('height')) {
				this.dim.height = Math.max(this.chart.view.min.height, this.dim.height);
			}
		}
		if (this.chart.view.max) {
			if (this.chart.view.max.hasOwnProperty('width')) {
				this.dim.width = Math.min(this.chart.view.max.width, this.dim.width);
			}
			if (this.chart.view.max.hasOwnProperty('height')) {
				this.dim.height = Math.min(this.chart.view.max.height, this.dim.height);
			}
		}
		if (this.cd) {
			this.cd.markForCheck();
		}
	}

	onActivate(item, group?) {
		let search = item;
		if (group) {
			search = Object.assign({}, item);
			if (group) {
				search.series = group.name;
			}
		}
		const idx = this.activeEntries.findIndex(d => {
			return d.name === search.name && d.value === search.value && d.series === search.series;
		});
		if (idx > -1) {
			return;
		}
		this.activeEntries = [search, ...this.activeEntries];
		this.activate.emit({value: search, entries: this.activeEntries});
	}

	onDeactivate(item, group?) {
		let search = item;
		if (group) {
			search = Object.assign({}, item);
			if (group) {
				search.series = group.name;
			}
		}
		const idx = this.activeEntries.findIndex(d => {
			return d.name === search.name && d.value === search.value && d.series === search.series;
		});

		this.activeEntries.splice(idx, 1);
		this.activeEntries = [...this.activeEntries];

		this.deactivate.emit({value: search, entries: this.activeEntries});
	}

	private getContainerDims(): IChartDimension {
		if (!this.platform.isBrowser) {
			return this.chart.view.def ? this.chart.view.def : {width: 400, height: 300};
		}
		let width = 0;
		let height = 0;
		const hostElem = this.chartElement.nativeElement;
		if (hostElem.parentNode != null) {
			// Get the container dimensions
			width = hostElem.parentNode.clientWidth;
			height = hostElem.parentNode.clientHeight;
		}
		return {width, height};
	}

	private bindWindowResizeEvent(): void {
		this.zone.run(() => {
			let source = Observable.fromEvent(window, 'resize', null, null);
			let subscription = source.debounceTime(200).subscribe(e => {
				let newdims = this.getContainerDims();
				if (!this.lastdim || this.lastdim.height !== newdims.height || this.lastdim.width !== newdims.width) {
					this.update();
					if (this.cd) {
						this.cd.markForCheck();
					}
				}
				this.lastdim = newdims;
			});
			this.resizeSubscription = subscription;
		});
	}

	private unbindEvents(): void {
		if (this.resizeSubscription) {
			this.resizeSubscription.unsubscribe();
		}
	}

}
