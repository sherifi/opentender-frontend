import {Component} from '@angular/core';
import {IIndicatorInfo} from '../../../app.interfaces';
import {IndicatorService} from '../../../services/indicator.service';

/**
 * The /about/glossary component displays information on procurement technical terms
 */

@Component({
	moduleId: __filename,
	selector: 'glossary',
	templateUrl: 'glossary.component.html'
})
export class AboutGlossaryPage {
	public indicatorInfos: IIndicatorInfo[] = [];

	constructor(private indicators: IndicatorService) {
		this.indicatorInfos = indicators.GROUPS;
	}

}
