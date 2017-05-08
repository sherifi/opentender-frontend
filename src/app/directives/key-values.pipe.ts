import {PipeTransform, Pipe} from '@angular/core';

@Pipe({name: 'keys'})
export class KeyValuesPipe implements PipeTransform {
	transform(value, args: string[]): any {
		let keys = [];
		if (value) {
			for (let key in value) {
				keys.push({key: key, value: value[key]});
			}
		}
		return keys;
	}
}
