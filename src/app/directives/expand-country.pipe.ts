import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from '../model/utils';

@Pipe({
	name: 'expandCountry'
})
export class ExpandCountryPipe implements PipeTransform {
	transform(value: string, args: any[]): string {
		return Utils.expandCountry(value);
	}
}
