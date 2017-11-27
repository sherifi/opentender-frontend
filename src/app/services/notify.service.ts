import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {PlatformService} from './platform.service';

@Injectable()
export class NotifyService {

	private lastNotify: number = 0;
	private timeout: number = 10000;

	constructor(private toastrService: ToastrService, private platform: PlatformService) {

	}

	error(e: string | Error) {
		console.error(e);
		if (!this.platform.isBrowser) {
			return;
		}
		let options = {
			timeOut: this.timeout
		};
		let now = (new Date()).valueOf();
		if (now - this.lastNotify < this.timeout) {
			return;
		}
		this.lastNotify = now;
		this.toastrService.error('An error occurred, please reload the page to try again', 'Error', options);
	}

}
