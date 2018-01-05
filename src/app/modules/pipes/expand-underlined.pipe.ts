import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from '../../model/utils';

@Pipe({name: 'expandUnderlined'})
export class ExpandUnderlinedPipe implements PipeTransform {
	transform(value: string): string {
		return Utils.expandUnderlined(value);
	}
}
