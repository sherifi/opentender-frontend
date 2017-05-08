import {Component} from '@angular/core';
import {PortalsService} from '../../../services/portals.service';

@Component({
	moduleId: __filename,
	selector: 'foi',
	templateUrl: 'foi.template.html'
})
export class DocumentationFOIPage {
	portals: Array<any>;

	constructor(portalservice: PortalsService) {
		this.portals = portalservice.get();
	}

}
