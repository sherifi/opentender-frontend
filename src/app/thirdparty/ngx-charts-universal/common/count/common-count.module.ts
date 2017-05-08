import {NgModule} from '@angular/core';
import {CountUpDirective} from './count.directive';

const COMPONENTS = [CountUpDirective];

@NgModule({
	imports: [],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS]
})
export class CommonCountModule {
}
