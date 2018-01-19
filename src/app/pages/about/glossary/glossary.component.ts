import {Component} from '@angular/core';
import {IIndicatorInfo} from '../../../app.interfaces';
import {IndicatorService} from '../../../services/indicator.service';
import {I18NService} from '../../../modules/i18n/services/i18n.service';

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
	public numbers = [];

	constructor(private indicators: IndicatorService, private i18n: I18NService) {
		this.indicatorInfos = indicators.GROUPS;
		let num = 1000000;
		for (let i = 0; i < 6; i++) {
			this.numbers.push({name: this.i18n.formatValue(num), value: this.i18n.getLargeNumberString(2 + i)});
			num = num * 1000;
		}

	}

}
