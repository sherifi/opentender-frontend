import {Component, Input, EventEmitter, Output} from '@angular/core';
import Body = Definitions.Body;

@Component({
	moduleId: __filename,
	selector: 'select-similar-list',
	templateUrl: 'select-similar-list.component.html',
	styleUrls: ['select-similar-list.component.scss']
})
export class SelectSimilarListComponent {
	@Input()
	similar: Array<Body> = [];
	@Input()
	current: Body;
	@Input()
	caption: string;
	@Input()
	link: string;
	@Input()
	icon: string;
	@Output()
	selectChange = new EventEmitter();

	public search_similars = {};

	constructor() {
	}

	public triggerChange(): void {
		let ids = Object.keys(this.search_similars).filter((key) => this.search_similars[key]);
		this.selectChange.emit({value: ids});
	}

	public markNone(): void {
		this.search_similars = {};
		this.triggerChange();
	}

	public markAll(): void {
		this.similar.forEach(body => this.search_similars[body.id] = true);
		this.triggerChange();
	}

}
