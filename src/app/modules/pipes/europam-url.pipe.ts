import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'europamLink'})
export class EuropamLinkPipe implements PipeTransform {

	transform(value: string): string {
		return 'http://europam.eu/?module=country-profile' + (value !== 'Europe' ? '&country=' + value : '') + '#info_PP';
	}

}
