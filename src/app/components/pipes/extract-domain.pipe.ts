import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'extractDomain'})
export class ExtractDomainPipe implements PipeTransform {

	transform(value: string): string {
		let domain = value;
		let pos = (domain.indexOf('://') > -1) ? 2 : 0;
		domain = domain.split('/')[pos] || '';
		domain = domain.split(':')[0];
		return domain || '';
	}

}
