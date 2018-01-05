import {Component} from '@angular/core';
import {ConfigService} from '../../../services/config.service';

/**
 * The /about/how-opentender-works component displays a information on the data processing and the usage of the page
 */

@Component({
	moduleId: __filename,
	selector: 'how',
	templateUrl: 'how.component.html'
})
export class AboutHowPage {
	public contactmail: string;

	constructor(private config: ConfigService) {
		this.contactmail = config.contactmail;
	}
}
