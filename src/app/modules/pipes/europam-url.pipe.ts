import {Pipe, PipeTransform} from '@angular/core';
import {Consts} from '../../model/consts';

@Pipe({name: 'europamLink'})
export class EuropamLinkPipe implements PipeTransform {

	transform(value: string): string {
		if (!value) {
			return 'http://europam.eu/';
		}
		let country = Consts.countries[value.toUpperCase()];
		if (!country) {
			if (value === 'eu') {
				country = 'European Commission';
			}
		}
		return 'http://europam.eu/?module=country-profile' + (country !== null ? '&country=' + country : '') + '#info_PP';
	}

}
