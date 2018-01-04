import {Pipe, PipeTransform} from '@angular/core';
import {ConfigService} from '../../services/config.service';

@Pipe({name: 'portalLink'})
export class PortalLinkPipe implements PipeTransform {

	constructor(private config: ConfigService) {

	}

	transform(value: string): string {
		if (this.config.locale) {
			return value + '?lang=' + this.config.locale;
		}
		return value;
	}

}
