import {Component, Directive, QueryList, ElementRef, Input, ViewChildren, AfterViewInit, Renderer, OnChanges, SimpleChanges} from '@angular/core';
import {ApiService} from '../services/api.service';

@Directive({selector: 'g.country'})
export class SVGCountryGroupDirective {
	@Input() id: string;
	portal: any;

	constructor(private el: ElementRef, public renderer: Renderer) {
		renderer.listen(el.nativeElement, 'click', (event) => {
			if (this.portal) {
				window.location.href = '/' + (this.portal.id || '');
			}
		});
	}

	public setData(portal: any) {
		this.portal = portal;
		if (portal.current) {
			this.renderer.setElementClass(this.el.nativeElement, 'current', true);
		} else if (portal.count > 0) {
			this.renderer.setElementClass(this.el.nativeElement, 'active', true);
		}
	}
}

@Component({
	selector: 'portal-map',
	templateUrl: 'map-portal.template.html'
})
export class PortalMapComponent implements AfterViewInit, OnChanges {
	@Input() portals: any;
	@ViewChildren(SVGCountryGroupDirective) items: QueryList<SVGCountryGroupDirective>;
	public svg: Array<{id: string; p: Array<string>; c?: Array<{cx: number; cy: number; r: number}>}>;

	constructor(private api: ApiService) {
	}

	public ngAfterViewInit(): void {
		this.api.getPortalMapData().subscribe(
			res => {
				this.display(res);
			},
			error => {
				console.log(error);
			});
	}

	display(svg) {
		this.svg = svg;
		setTimeout(() => {
			this.apply();
		}, 0);
	};

	apply() {
		if (this.portals && this.items && this.svg) {
			this.items.forEach((item) => {
				let portal = this.portals.filter(p => p.id == item.id)[0];
				if (portal) {
					item.setData(portal);
				}
			});
		}
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.apply();
	}

}
