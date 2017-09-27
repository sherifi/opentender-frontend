import {Injectable} from '@angular/core';
import {ToastOptions, ToastyService} from 'ng2-toasty';
import {PlatformService} from './platform.service';

@Injectable()
export class NotifyService {

	constructor(private toastyService: ToastyService, private platform: PlatformService) {

	}

	error(e: string | Error) {
		// this.error = error._body;
		// this.error = error._body.statusText || 'Connection refused.';
		// this.error = error._body.statusText || 'Connection refused.';
		console.error(e);
		if (!this.platform.isBrowser) {
			return;
		}
		const toastOptions: ToastOptions = {
			title: 'Error',
			msg: 'An error occurred, please reload the page to try again',
			showClose: true,
			timeout: 5000,
			theme: 'default'
		};
		this.toastyService.error(toastOptions);
	}

}
