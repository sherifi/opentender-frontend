import {Pipe, PipeTransform} from '@angular/core';
import {IndicatorService} from '../../services/indicator.service';

@Pipe({name: 'formatIndicatorName'})
export class FormatIndicatorNamePipe implements PipeTransform {

	constructor(private indicators: IndicatorService) {
	}

	transform(value: string): string {
		return this.indicators.formatIndicatorName(value);
	}

}

