import {Component, Input} from '@angular/core';

@Component({
	moduleId: __filename,
	selector: 'loading',
	templateUrl: 'loading.component.html',
	styleUrls: ['loading.component.scss']
})
export class LoadingComponent {
	@Input() loading: boolean = false;
	@Input() notFound: boolean = false;
}
