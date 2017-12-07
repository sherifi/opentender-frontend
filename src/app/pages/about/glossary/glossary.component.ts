import {Component} from '@angular/core';
import {Utils} from '../../../model/utils';
import {IIndicatorInfo} from '../../../app.interfaces';

/**
 * The /about/glossary component displays information on procurement technical terms
 */

@Component({
	moduleId: __filename,
	selector: 'glossary',
	templateUrl: 'glossary.component.html'
})
export class AboutGlossaryPage {
	public indicators: IIndicatorInfo[] = [];

	constructor() {
		this.indicators = Utils.indicators();
	}

}
