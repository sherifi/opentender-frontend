import {Injectable} from '@angular/core';
import {InjectionService} from '../services/injection.service';
import {InjectionRegistery} from '../services/injection-registery.service';
import {TooltipContentComponent} from './tooltip.component';

@Injectable()
export class TooltipService extends InjectionRegistery {

	type: any = TooltipContentComponent;

	constructor(injectionService: InjectionService) {
		super(injectionService);
	}

}
