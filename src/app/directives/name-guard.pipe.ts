import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from '../model/utils';

@Pipe({name: 'nameGuard'})
export class NameGuardPipe implements PipeTransform {

	transform(value: string): string {
		return Utils.nameGuard(value);
	}

}
