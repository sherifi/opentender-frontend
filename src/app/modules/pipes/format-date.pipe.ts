import {Pipe, PipeTransform} from '@angular/core';
import {I18NService} from '../i18n/services/i18n.service';

@Pipe({name: 'formatDate'})
export class FormatDatePipe implements PipeTransform {

	constructor(private i18n: I18NService) {
	}

	transform(value: string): string {
		return this.i18n.formatDate(value);
	}

}
