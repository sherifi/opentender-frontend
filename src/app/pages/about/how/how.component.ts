import {Component} from '@angular/core';
import {Consts} from '../../../model/consts';

@Component({
	moduleId: __filename,
	selector: 'how',
	templateUrl: 'how.template.html'
})
export class AboutHowPage {
	lorem = Consts.IPSUM;
}
