import {Component, Directive, QueryList, ElementRef, Input, ViewChildren, AfterViewInit, OnChanges, SimpleChanges, Renderer2} from '@angular/core';
import {ApiService} from '../services/api.service';
import {ICountryStats} from '../app.interfaces';
import {Country, CountryService} from '../services/country.service';

@Directive({selector: 'g.country'})
export class SVGCountryGroupDirective {
	@Input() id: string;
	portal: ICountryStats;
	current: boolean;

	constructor(private el: ElementRef, public renderer: Renderer2) {
		renderer.listen(el.nativeElement, 'click', (event) => {
			if (this.portal) {
				window.location.href = '/' + (this.portal.id || '');
			}
		});
	}

	public setData(portal: ICountryStats, isCurrent: boolean) {
		this.portal = portal;
		this.current = isCurrent;
		if (this.current) {
			this.renderer.addClass(this.el.nativeElement, 'current');
		} else if (portal.value > 0) {
			this.renderer.addClass(this.el.nativeElement, 'active');
		}
	}
}

@Component({
	selector: 'portal-map',
	templateUrl: 'map-portal.template.html'
})
export class PortalMapComponent implements AfterViewInit, OnChanges {
	@Input() portals: Array<ICountryStats>;
	@ViewChildren(SVGCountryGroupDirective) items: QueryList<SVGCountryGroupDirective>;
	public svg: Array<{ id: string; p: Array<string>; c?: Array<{ cx: number; cy: number; r: number }> }>;
	public current: Country;

	constructor(private api: ApiService, private country: CountryService) {
		this.current = country.get();
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
					item.setData(portal, item.id === this.current.id);
				}
			});
		}
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.apply();
	}

}
