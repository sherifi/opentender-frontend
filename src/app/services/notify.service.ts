import {Injectable} from '@angular/core';
import {ToastOptions, ToastyService} from 'ng2-toasty';
import {PlatformService} from './platform.service';

@Injectable()
export class NotifyService {

	private lastNotify: number = 0;
	private timeout: number = 10000;

	constructor(private toastyService: ToastyService, private platform: PlatformService) {

	}

	error(e: string | Error) {
		console.error(e);
		if (!this.platform.isBrowser) {
			return;
		}

		let now = (new Date()).valueOf();
		if (now - this.lastNotify > this.timeout) {
			return;
		}
		this.lastNotify = now;

		const toastOptions: ToastOptions = {
			title: 'Error',
			msg: 'An error occurred, please reload the page to try again',
			showClose: true,
			timeout: this.timeout,
			theme: 'default'
		};
		this.toastyService.error(toastOptions);
	}

}
