import {Pipe} from '@angular/core'

@Pipe({
	name: 'extractdomain'
})
export class ExtractDomainPipe {
	transform(value: string, args): string {
		let domain = value;
		if (value.indexOf('://') > -1) {
			domain = value.split('/')[2];
		} else {
			domain = value.split('/')[0];
		}
		domain = domain.split(':')[0];
		return domain;
	}
}
