import {Component} from '@angular/core';
import {PlatformService} from '../../services/platform.service';

@Component({
	moduleId: __filename,
	selector: 'cookielaw',
	templateUrl: 'cookielaw.component.html',
	styleUrls: ['cookielaw.component.scss']
})
export class CookielawComponent {
	public visible: boolean = false;
	private key = 'opentender.cookielaw';

	constructor(private platform: PlatformService) {
		if (platform.isBrowser) {
			if (window.localStorage) {
				let hasSeen = window.localStorage.getItem(this.key);
				this.visible = hasSeen !== 'true';
			}
		}
	}

	public close(event) {
		if (this.platform.isBrowser) {
			if (window.localStorage) {
				window.localStorage.setItem(this.key, 'true');
			}
		}
		this.visible = false;
	}

}
