import {Component} from '@angular/core';
import {Consts} from '../../../model/consts';

/**
 * The /about/how-opentender-works component displays a information on the data processing and the usage of the page
 */

@Component({
	moduleId: __filename,
	selector: 'how',
	templateUrl: 'how.template.html'
})
export class AboutHowPage {
	public lorem: string = Consts.IPSUM;
}
