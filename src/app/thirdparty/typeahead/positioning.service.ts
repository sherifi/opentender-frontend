/**
 * @copyright Valor Software
 * @copyright Angular ng-bootstrap team
 */

import {Injectable, ElementRef} from '@angular/core';

export class Positioning {
	public position(element: HTMLElement, round = true): ClientRect {
		let elPosition: ClientRect;
		let parentOffset: ClientRect = {width: 0, height: 0, top: 0, bottom: 0, left: 0, right: 0};

		if (this.getStyle(element, 'position') === 'fixed') {
			elPosition = element.getBoundingClientRect();
		} else {
			const offsetParentEl = this.offsetParent(element);

			elPosition = this.offset(element, false);

			if (offsetParentEl !== document.documentElement) {
				parentOffset = this.offset(offsetParentEl, false);
			}

			parentOffset.top += offsetParentEl.clientTop;
			parentOffset.left += offsetParentEl.clientLeft;
		}

		elPosition.top -= parentOffset.top;
		elPosition.bottom -= parentOffset.top;
		elPosition.left -= parentOffset.left;
		elPosition.right -= parentOffset.left;

		if (round) {
			elPosition.top = Math.round(elPosition.top);
			elPosition.bottom = Math.round(elPosition.bottom);
			elPosition.left = Math.round(elPosition.left);
			elPosition.right = Math.round(elPosition.right);
		}

		return elPosition;
	}

	public offset(element: HTMLElement, round = true): ClientRect {
		const elBcr = element.getBoundingClientRect();
		const viewportOffset = {
			top: window.pageYOffset - document.documentElement.clientTop,
			left: window.pageXOffset - document.documentElement.clientLeft
		};

		let elOffset = {
			height: elBcr.height || element.offsetHeight,
			width: elBcr.width || element.offsetWidth,
			top: elBcr.top + viewportOffset.top,
			bottom: elBcr.bottom + viewportOffset.top,
			left: elBcr.left + viewportOffset.left,
			right: elBcr.right + viewportOffset.left
		};

		if (round) {
			elOffset.height = Math.round(elOffset.height);
			elOffset.width = Math.round(elOffset.width);
			elOffset.top = Math.round(elOffset.top);
			elOffset.bottom = Math.round(elOffset.bottom);
			elOffset.left = Math.round(elOffset.left);
			elOffset.right = Math.round(elOffset.right);
		}

		return elOffset;
	}

	public positionElements(hostElement: HTMLElement, targetElement: HTMLElement, placement: string, appendToBody?: boolean):
	ClientRect {
		const hostElPosition = appendToBody ? this.offset(hostElement, false) : this.position(hostElement, false);
		const shiftWidth: any = {
			left: hostElPosition.left,
			center: hostElPosition.left + hostElPosition.width / 2 - targetElement.offsetWidth / 2,
			right: hostElPosition.left + hostElPosition.width
		};
		const shiftHeight: any = {
			top: hostElPosition.top,
			center: hostElPosition.top + hostElPosition.height / 2 - targetElement.offsetHeight / 2,
			bottom: hostElPosition.top + hostElPosition.height
		};
		const targetElBCR = targetElement.getBoundingClientRect();
		const placementPrimary = placement.split(' ')[0] || 'top';
		const placementSecondary = placement.split(' ')[1] || 'center';

		let targetElPosition: ClientRect = {
			height: targetElBCR.height || targetElement.offsetHeight,
			width: targetElBCR.width || targetElement.offsetWidth,
			top: 0,
			bottom: targetElBCR.height || targetElement.offsetHeight,
			left: 0,
			right: targetElBCR.width || targetElement.offsetWidth
		};

		switch (placementPrimary) {
			case 'top':
				targetElPosition.top = hostElPosition.top - targetElement.offsetHeight;
				targetElPosition.bottom += hostElPosition.top - targetElement.offsetHeight;
				targetElPosition.left = shiftWidth[placementSecondary];
				targetElPosition.right += shiftWidth[placementSecondary];
				break;
			case 'bottom':
				targetElPosition.top = shiftHeight[placementPrimary];
				targetElPosition.bottom += shiftHeight[placementPrimary];
				targetElPosition.left = shiftWidth[placementSecondary];
				targetElPosition.right += shiftWidth[placementSecondary];
				break;
			case 'left':
				targetElPosition.top = shiftHeight[placementSecondary];
				targetElPosition.bottom += shiftHeight[placementSecondary];
				targetElPosition.left = hostElPosition.left - targetElement.offsetWidth;
				targetElPosition.right += hostElPosition.left - targetElement.offsetWidth;
				break;
			case 'right':
				targetElPosition.top = shiftHeight[placementSecondary];
				targetElPosition.bottom += shiftHeight[placementSecondary];
				targetElPosition.left = shiftWidth[placementPrimary];
				targetElPosition.right += shiftWidth[placementPrimary];
				break;
		}

		targetElPosition.top = Math.round(targetElPosition.top);
		targetElPosition.bottom = Math.round(targetElPosition.bottom);
		targetElPosition.left = Math.round(targetElPosition.left);
		targetElPosition.right = Math.round(targetElPosition.right);

		return targetElPosition;
	}

	private getStyle(element: HTMLElement, prop: string): string { return (window.getComputedStyle(element) as any)[prop]; }

	private isStaticPositioned(element: HTMLElement): boolean {
		return (this.getStyle(element, 'position') || 'static') === 'static';
	}

	private offsetParent(element: HTMLElement): HTMLElement {
		let offsetParentEl = <HTMLElement>element.offsetParent || document.documentElement;

		while (offsetParentEl && offsetParentEl !== document.documentElement && this.isStaticPositioned(offsetParentEl)) {
			offsetParentEl = <HTMLElement>offsetParentEl.offsetParent;
		}

		return offsetParentEl || document.documentElement;
	}
}

const positionService = new Positioning();

export function positionElements(
	hostElement: HTMLElement, targetElement: HTMLElement, placement: string, appendToBody?: boolean): void {
	const pos = positionService.positionElements(hostElement, targetElement, placement, appendToBody);

	targetElement.style.top = `${pos.top}px`;
	targetElement.style.left = `${pos.left}px`;
}

export interface PositioningOptions {
	/** The DOM element, ElementRef, or a selector string of an element which will be moved */
	element?: HTMLElement | ElementRef | string;

	/** The DOM element, ElementRef, or a selector string of an element which the element will be attached to  */
	target?: HTMLElement | ElementRef | string;

	/**
	 * A string of the form 'vert-attachment horiz-attachment' or 'placement'
	 * - placement can be "top", "bottom", "left", "right"
	 * not yet supported:
	 * - vert-attachment can be any of 'top', 'middle', 'bottom'
	 * - horiz-attachment can be any of 'left', 'center', 'right'
	 */
	attachment?: string;

	/** A string similar to `attachment`. The one difference is that, if it's not provided, `targetAttachment` will assume the mirror image of `attachment`. */
	targetAttachment?: string;

	/** A string of the form 'vert-offset horiz-offset'
	 * - vert-offset and horiz-offset can be of the form "20px" or "55%"
	 */
	offset?: string;

	/** A string similar to `offset`, but referring to the offset of the target */
	targetOffset?: string;

	/** If true component will be attached to body */
	appendToBody?: boolean;
}

@Injectable()
export class PositioningService {
	public position(options: PositioningOptions): void {
		const {element, target, attachment, appendToBody} = options;
		positionElements(
			this._getHtmlElement(target),
			this._getHtmlElement(element),
			attachment,
			appendToBody);
	}

	private _getHtmlElement(element: HTMLElement | ElementRef | string): HTMLElement {
		// it means that we got a selector
		if (typeof element === 'string') {
			return document.querySelector(element) as HTMLElement;
		}

		if (element instanceof ElementRef) {
			return element.nativeElement;
		}

		return element as HTMLElement;
	}
}
