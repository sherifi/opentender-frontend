import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'europamLink'
})
export class EuropamLinkPipe implements PipeTransform {
	transform(value: string, args: any[]): string {
		return 'http://europam.eu/?module=country-profile' + (value !== 'Europe' ? '&country=' + value : '') + '#info_PP';
	}
}
