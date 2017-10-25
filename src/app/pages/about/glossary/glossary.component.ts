import {Component} from '@angular/core';
import {Utils} from '../../../model/utils';
import {IndicatorInfo} from '../../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'glossary',
	templateUrl: 'glossary.template.html'
})
export class AboutGlossaryPage {
	private indicators: IndicatorInfo[] = [];

	constructor() {
		this.indicators = Utils.indicators();
	}

}
