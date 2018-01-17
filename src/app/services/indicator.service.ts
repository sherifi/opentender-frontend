import {Injectable} from '@angular/core';
import {I18NService} from '../modules/i18n/services/i18n.service';
import {IIndicatorInfo, ISubIndicatorInfo} from '../app.interfaces';
import * as Indicators from '../model/indicators.json';

export interface ISubIndicatorInfoConst {
	id: string;
	name: string;
	desc: string;
	order: number;
	notused?: boolean;
}

export interface IIndicatorInfoConst {
	id: string;
	name: string;
	plural: string;
	icon: string;
	subindicators: {
		[name: string]: ISubIndicatorInfoConst
	};
}

declare module '*indicators.json' {
	export var ADMINISTRATIVE: IIndicatorInfoConst;
	export var INTEGRITY: IIndicatorInfoConst;
	export var TRANSPARENCY: IIndicatorInfoConst;
}

@Injectable()
export class IndicatorService {
	private _indicators = Indicators;
	public ADMINISTRATIVE: IIndicatorInfo;
	public INTEGRITY: IIndicatorInfo;
	public TRANSPARENCY: IIndicatorInfo;
	public TENDER: IIndicatorInfo;
	public GROUPS: Array<IIndicatorInfo>;

	constructor(private i18n: I18NService) {
		this.ADMINISTRATIVE = this.buildIndicatorInfo(this._indicators.ADMINISTRATIVE);
		this.INTEGRITY = this.buildIndicatorInfo(this._indicators.INTEGRITY);
		this.TRANSPARENCY = this.buildIndicatorInfo(this._indicators.TRANSPARENCY);
		this.TENDER = {id: 'TENDER', name: i18n.get('Good Procurement Score'), plural: i18n.get('Good Procurement Score'), icon: '', subindicators: []};
		this.GROUPS = [this.ADMINISTRATIVE, this.TRANSPARENCY, this.INTEGRITY];
	}

	private buildIndicatorInfo(ii: IIndicatorInfoConst): IIndicatorInfo {
		return {
			id: ii.id,
			name: this.i18n.getStrict(ii.id + '.name') || ii.name,
			plural: this.i18n.getStrict(ii.id + '.plural') || ii.plural,
			icon: ii.icon,
			subindicators: Object.keys(ii.subindicators)
				.filter(subkey => !ii.subindicators[subkey].notused)
				.map(subkey => {
					let sub = ii.subindicators[subkey];
					return {
						id: subkey,
						name: this.i18n.getStrict(subkey + '.name') || sub.name,
						desc: this.i18n.getStrict(subkey + '.desc') || sub.desc,
						order: sub.order
					};
				})
		};
	}

	public getGroupOf(key: string): IIndicatorInfo {
		let id = key.split('_')[0];
		let group = this.GROUPS.find(g => g.id === id);
		return group || {id: '', name: '', plural: '', icon: '', subindicators: []};
	}

	public getIndicatorInfo(key: string): ISubIndicatorInfo {
		let result = null;
		let group = this.getGroupOf(key);
		if (group) {
			result = group.subindicators.find(sub => sub.id === key);
		}
		return result || {id: '', name: '', desc: '', order: -1};
	}

	public formatIndicatorName(value: string): string {
		let sub = this.getIndicatorInfo(value);
		if (!sub) {
			return value;
		}
		return sub.name;
	}

}
