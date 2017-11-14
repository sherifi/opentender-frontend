import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from '../model/utils';

@Pipe({name: 'expandCountry'})
export class ExpandCountryPipe implements PipeTransform {

	transform(value: string): string {
		return Utils.expandCountry(value);
	}

}
