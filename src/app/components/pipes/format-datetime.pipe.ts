import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from '../../model/utils';

@Pipe({name: 'formatDatetime'})
export class FormatDatetimePipe implements PipeTransform {

	transform(value: string): string {
		return Utils.formatDatetime(value);
	}

}
