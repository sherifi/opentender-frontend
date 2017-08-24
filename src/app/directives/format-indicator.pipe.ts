import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from '../model/utils';

@Pipe({name: 'formatIndicatorName'})
export class FormatIndicatorNamePipe implements PipeTransform {

	transform(value: string): string {
		return Utils.formatIndicatorName(value);
	}

}

