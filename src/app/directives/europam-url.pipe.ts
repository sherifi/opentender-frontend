import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'europamLink'
})
export class EuropamLinkPipe implements PipeTransform {
	transform(value: string, args: any[]): string {
		return 'http://europam.eu/?module=legislation' + (value !== 'Europe' ? '&country=' + value : '');
	}
}
