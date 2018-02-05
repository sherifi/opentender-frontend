import {Directive, ElementRef, Input, HostListener} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {PlatformService} from '../../services/platform.service';

@Directive({selector: '[pageScroll]'})
export class PageScrollDirective {

	@Input()
	public routerLink: string;

	@Input('pageScroll')
	public href: string;

	private document: Document;
	private body: HTMLBodyElement;

	constructor(private el: ElementRef, private router: Router, private platform: PlatformService) {
		if (platform.isBrowser) {
			this.document = el.nativeElement.ownerDocument;
			if (this.document) {
				this.body = el.nativeElement.ownerDocument.body;
			}
		}
	}

	@HostListener('click', ['$event'])
	private handleClick(event: any): boolean { // tslint:disable-line:noUnusedParameters
		if (this.routerLink) {
			this.scrollView(this.href);
			// Maybe we need to navigate there first.
			// Navigation is handled by the routerLink directive
			// so we only need to listen for route change
			// Note: the change event is also emitted when navigating to the current route again
			let sub = this.router.events.subscribe((e) => {
				if (e instanceof NavigationEnd) {
					sub.unsubscribe();
					setTimeout(() => {
						this.scrollView(this.href);
					}, 10);
				}
			});
		} else {
			this.scrollView(this.href);
		}
		return false; // to preventDefault()
	}

	private scrollView(anchor: string): void {
		if (!this.body || !this.document) {
			return;
		}
		let anchorTarget: HTMLElement = this.document.getElementById(anchor.substr(1));
		if (anchorTarget === null) {
			return;
		}
		this.document.documentElement.scrollTop = anchorTarget.offsetTop;
		this.body.scrollTop = anchorTarget.offsetTop;
	}

}
