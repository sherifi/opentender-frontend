import {Component} from '@angular/core';
import {PlatformService} from '../../services/platform.service';
import {ApiService} from '../../services/api.service';

@Component({
	moduleId: __filename,
	selector: 'test',
	templateUrl: 'test.template.html'
})
export class TestPage {

	constructor(private api: ApiService, private platform: PlatformService) {
	}

}
