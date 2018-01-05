import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from '../../model/utils';

@Pipe({name: 'formatDate'})
export class FormatDatePipe implements PipeTransform {

	transform(value: string): string {
		return Utils.formatDate(value);
	}

}
