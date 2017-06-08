import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'encodeURIComponent'
})
export class EncodeURIComponentPipe implements PipeTransform {

	transform(input: any) {
		if (!input) {
			return '';
		}
		return encodeURIComponent(input);
	}

}
