import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from '../../model/utils';

@Pipe({name: 'formatFileSize'})
export class FormatFileSizePipe implements PipeTransform {

	transform(value: number): string {
		return Utils.formatFileSize(value);
	}

}
