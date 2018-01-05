import {Pipe, PipeTransform} from '@angular/core';
import {I18NService} from '../services/i18n.service';

@Pipe({name: 'i18n'})
export class I18nPipe implements PipeTransform {

	constructor(public i18n: I18NService) {
	}

	transform(value: string): string {
		return this.i18n.get(value);
	}

}
