import {Component, Input, EventEmitter, Output} from '@angular/core';
import {I18NService} from '../../services/i18n.service';
import Body = Definitions.Body;

@Component({
	moduleId: __filename,
	selector: 'select-similar-list',
	templateUrl: 'select-similar-list.component.html'
})
export class SelectSimilarListComponent {
	@Input()
	similar: Array<Body> = [];
	@Input()
	current: Body;
	@Input()
	title: string;
	@Input()
	link: string;
	@Input()
	icon: string;
	@Output()
	selectChange = new EventEmitter();

	public showDebug: boolean = false;
	public search_similars = {};

	constructor(public i18n: I18NService) {
	}

	toggleSimilar(body: Body): void {
		this.search_similars[body.id] = !this.search_similars[body.id];
		let ids = Object.keys(this.search_similars).filter((key) => {
			return this.search_similars[key];
		});
		this.selectChange.emit({value: ids});
	}

	plain(o) {
		return JSON.stringify(o, null, '\t');
	}
}
