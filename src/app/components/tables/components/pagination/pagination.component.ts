import {Component, Input, OnChanges, OnInit, SimpleChanges, EventEmitter, Output} from '@angular/core';

@Component({
	selector: 'pagination',
	templateUrl: 'pagination.component.html',
	styleUrls: ['pagination.component.scss']
})
export class PaginationComponent implements OnChanges, OnInit {
	@Input()
	total: number;
	@Input()
	defaultPageSize: number;
	@Input()
	defaultPage: number;
	@Output()
	paginationChange = new EventEmitter();

	public pagination = {
		pageCount: 0,
		pageSize: 10,
		page: 0,
		total: 0,
		quick: []
	};

	constructor() {
	}

	public ngOnInit(): void {
		this.pagination.pageSize = this.defaultPageSize || 10;
		this.pagination.page = this.defaultPage || 0;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['total']) {
			this.display(changes['total'].currentValue);
		} else if (changes['defaultPageSize']) {
			this.pagination.pageSize = changes['defaultPageSize'].currentValue;
		} else if (changes['defaultPage']) {
			this.pagination.page = changes['defaultPage'].currentValue;
		}
	}

	public next() {
		if (this.pagination.page < this.pagination.pageCount - 1) {
			this.pagination.page += 1;
			this.triggerChange();
		}
	}

	public previous() {
		if (this.pagination.page > 0) {
			this.pagination.page -= 1;
			this.triggerChange();
		}
	}

	public page(page: number) {
		this.pagination.page = page;
		this.triggerChange();
	}

	private triggerChange() {
		this.paginationChange.emit({value: this.pagination});
	}

	public onPageSizeChange() {
		this.display(this.pagination.total);
		this.triggerChange();
	}

	private display(total: number): void {
		this.pagination.total = total;
		this.pagination.pageCount = Math.ceil(this.pagination.total / this.pagination.pageSize);
		this.pagination.quick = [];
		let current = this.pagination.page;
		let items: Array<any> = [current];
		let back = 0;
		let front = 0;
		while (items.length < 3) {
			if (current - front > 0) {
				front++;
				items.unshift(current - front);
			}
			if (current + back < this.pagination.pageCount) {
				back++;
				items.push(current + back);
			}
			if ((current - front == 0) && (current + back == this.pagination.pageCount)) {
				break;
			}
		}
		let sep = false;
		for (let i = 2; i >= 0; i--) {
			if (items.indexOf(i) < 0) {
				if (!sep) {
					items.unshift('sep');
				}
				sep = true;
				items.unshift(i);
			}
		}
		this.pagination.quick = items;
	}

}
