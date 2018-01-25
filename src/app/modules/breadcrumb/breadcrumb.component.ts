import {Component, Input} from '@angular/core';
import {ConfigService} from '../../services/config.service';
import {IBreadcrumb} from '../../app.interfaces';

@Component({
	selector: 'breadcrumb',
	templateUrl: 'breadcrumb.component.html',
	styleUrls: ['breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
	@Input()
	crumbs: Array<IBreadcrumb> = [];

	constructor(public config: ConfigService) {
	}

}
