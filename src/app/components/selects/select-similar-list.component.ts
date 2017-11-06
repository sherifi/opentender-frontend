import {Component, Input, EventEmitter, Output, OnChanges, SimpleChanges} from '@angular/core';
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

	public search_similars = {};

	constructor() {
	}

	toggleSimilar(body: Body): void {
		this.search_similars[body.id] = !this.search_similars[body.id];
		let ids = Object.keys(this.search_similars).filter((key) => {
			return this.search_similars[key];
		});
		this.selectChange.emit({value: ids});
	}
}
