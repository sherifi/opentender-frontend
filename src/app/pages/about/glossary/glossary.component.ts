import {Component} from '@angular/core';
import {Utils} from '../../../model/utils';
import {IIndicatorInfo} from '../../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'glossary',
	templateUrl: 'glossary.template.html'
})
export class AboutGlossaryPage {
	public indicators: IIndicatorInfo[] = [];

	constructor() {
		this.indicators = Utils.indicators();
	}

}
