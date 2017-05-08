import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from '../model/utils';

@Pipe({
	name: 'expandUnderlined'
})
export class ExpandUnderlinedPipe implements PipeTransform {
	transform(value: string, args: any[]): string {
		return Utils.expandUnderlined(value);
	}
}
