import {Component} from '@angular/core';
import {Consts} from '../../../model/consts';

@Component({
	moduleId: __filename,
	selector: 'how',
	templateUrl: 'how.template.html'
})
export class AboutHowPage {
	dummies = [1, 2, 3].map(nr => {
		return {
			title: 'Lorem Ipsum',
			text: Consts.IPSUM + ' ' + Consts.IPSUM + ' ' + Consts.IPSUM + ' ' + Consts.IPSUM
		};
	});
}
