import {Component} from '@angular/core';
import {Utils} from '../../../model/utils';
import Indicator = Definitions.Indicator;

@Component({
	moduleId: __filename,
	selector: 'glossary',
	templateUrl: 'glossary.template.html'
})
export class AboutGlossaryPage {
	private indicators: Indicator[] = [];

	constructor() {
		this.indicators = Utils.indicators();
	}

}
