import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from '../../model/utils';

@Pipe({
	name: 'defined'
})
export class DefinedPipe implements PipeTransform {

	transform(value: any): boolean {
		return Utils.isDefined(value);
	}

}
