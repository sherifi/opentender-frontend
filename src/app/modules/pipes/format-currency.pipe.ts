import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from '../../model/utils';

@Pipe({name: 'formatCurrencyValue'})
export class FormatCurrencyValuePipe implements PipeTransform {

	transform(value: number, fractionSize: number = 2): string {
		return Utils.formatCurrencyValue(value, fractionSize);
	}

}

@Pipe({name: 'formatCurrency'})
export class FormatCurrencyPipe implements PipeTransform {

	transform(value: string): string {
		return Utils.formatCurrency(value);
	}

}
