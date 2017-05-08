import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'defined'
})
export class DefinedPipe implements PipeTransform {
	transform(value: any, args: any[]): boolean {
		if (value === undefined || value === null) return false;
		if (Array.isArray(value) || (typeof value === 'string')) return value.length > 0;
		return true;
	}
}
