import {Pipe, PipeTransform} from '@angular/core';
import {Country} from '../../services/config.service';

@Pipe({name: 'foiSearchLink'})
export class FOISearchLinkPipe implements PipeTransform {

	transform(value: string, country: Country): string {
		if (!value || !country || !country.foi) {
			return '';
		}
		return country.foi.url + country.foi.search.replace('{subject}', encodeURIComponent(value));
	}

}
