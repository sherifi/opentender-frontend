import {PLATFORM_ID} from '@angular/core';
import {isPlatformServer} from '@angular/common';

import {Injectable, Inject} from '@angular/core';

@Injectable()
export class PlatformService {
	public isBrowser: boolean = true;

	constructor(@Inject(PLATFORM_ID) private platformId: Object) {
		// if (isPlatformBrowser(this.platformId)) {}
		if (isPlatformServer(this.platformId)) {
			this.isBrowser = false;
		}
	}

}
