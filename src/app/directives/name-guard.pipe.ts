import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'nameGuard'
})
export class NameGuardPipe implements PipeTransform {
	transform(value: string, args: any[]): string {
		return value || '[Name not available]';
	}
}
