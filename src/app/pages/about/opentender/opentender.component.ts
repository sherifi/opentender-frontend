import {Component} from '@angular/core';
import {Consts} from '../../../model/consts';

@Component({
	moduleId: __filename,
	selector: 'opentender-about',
	templateUrl: 'opentender.template.html'
})
export class AboutOpentenderPage {
	lorem = Consts.IPSUM;
}
