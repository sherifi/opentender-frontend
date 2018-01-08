import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from '../../model/utils';
import {I18NService} from '../i18n/services/i18n.service';

@Pipe({name: 'formatNumber'})
export class FormatNumberPipe implements PipeTransform {

	constructor(private i18n: I18NService) {
	}

	transform(value: number): string {
		return this.i18n.formatValue(value);
	}

}

