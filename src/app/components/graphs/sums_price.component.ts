import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IStatsPrices} from '../../app.interfaces';
import {I18NService} from '../../services/i18n.service';

@Component({
	selector: 'graph[sum_prices]',
	template: `
		<div class="title">Total Contract Value <i class="icon-info" ngx-tooltip [tooltipTitle]="tooltipTitle"></i></div>
		<div *ngFor="let val of sum_prices">
			<span class="currency-prefix">{{val.currency | formatCurrency}}</span> <span>{{val.value | formatCurrencyValue}}</span>
		</div>`
})
export class GraphSumPricesComponent implements OnChanges {
	@Input()
	data: IStatsPrices;
	sum_prices = [];
	tooltipTitle: string;

	constructor(private i18n: I18NService) {
		this.tooltipTitle = this.i18n.get('Net amount of the tender final price is used to calculate the sum');
	}


	ngOnChanges(changes: SimpleChanges): void {
		this.sum_prices = [];
		if (this.data) {
			Object.keys(this.data).forEach(key => {
				if (this.data[key] > 0) {
					this.sum_prices.push({currency: key.toString().toUpperCase(), value: this.data[key]});
				}
			});
		}
	}

}
