import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from '../model/utils';

@Pipe({name: 'formatNumber'})
export class FormatNumberPipe implements PipeTransform {

	transform(value: number): string {
		return Utils.formatValue(value);
	}

}

