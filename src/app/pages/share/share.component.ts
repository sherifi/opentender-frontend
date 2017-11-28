import {Component} from '@angular/core';
import {PlatformService} from '../../services/platform.service';
import {ApiService} from '../../services/api.service';
import {IStatsInYears} from '../../app.interfaces';
import {NotifyService} from '../../services/notify.service';

@Component({
	moduleId: __filename,
	selector: 'share',
	templateUrl: 'share.template.html'
})
export class SharePage {

	shareType: string = 'home-histogram';

	data: {
		home_histogram?: IStatsInYears
	} = {};

	constructor(private api: ApiService, private platform: PlatformService, private notify: NotifyService) {
		this.displayType('home-map');
	}

	displayType(type: string) {
		this.shareType = type;
		switch (type) {
			case 'home-histogram':
				this.api.getHomeStats().subscribe(
					(result) => {
						this.data.home_histogram = result.data.histogram;
					},
					(error) => {
						this.notify.error(error);
					},
					() => {
					});
				break;
		}

	}

}
