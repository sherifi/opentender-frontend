import {Component, Input, EventEmitter, Output, OnChanges, SimpleChanges} from '@angular/core';
import {I18NService} from '../../../../modules/i18n/services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'select-viz-button',
	templateUrl: 'select-viz-button.component.html',
	styleUrls: ['select-viz-button.component.scss']
})
export class SelectVizButtonComponent implements OnChanges {
	@Input()
	viz: any;
	@Output()
	selectChange = new EventEmitter();
	showDialog = false;
	title: string;
	list: Array<{ id: string; title: string; active: boolean }>;

	constructor(public i18n: I18NService) {
		this.title = i18n.get('Select Visualization');
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.list = Object.keys(this.viz).map(key => {
			return {id: key, title: this.viz[key].title, active: this.viz[key].active};
		});
	}

	update(s) {
		this.selectChange.emit(this.list.filter(item => item.active).map(item => item.id));
	}
}
