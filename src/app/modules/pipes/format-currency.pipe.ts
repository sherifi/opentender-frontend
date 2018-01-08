import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from '../../model/utils';
import {I18NService} from '../i18n/services/i18n.service';

@Pipe({name: 'formatCurrencyValue'})
export class FormatCurrencyValuePipe implements PipeTransform {
	constructor(private i18n: I18NService) {
	}

	transform(value: number, fractionSize: number = 2): string {
		return this.i18n.formatCurrencyValue(value, fractionSize);
	}

}

@Pipe({name: 'formatCurrency'})
export class FormatCurrencyPipe implements PipeTransform {
	constructor(private i18n: I18NService) {
	}

	transform(value: string): string {
		return this.i18n.formatCurrency(value);
	}
}
