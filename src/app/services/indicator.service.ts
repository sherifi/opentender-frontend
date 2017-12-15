import {Injectable} from '@angular/core';
import {I18NService} from './i18n.service';
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
	export var CORRUPTION: IIndicatorInfoConst;
	export var TRANSPARENCY: IIndicatorInfoConst;
}

@Injectable()
export class IndicatorService {
	private _indicators = Indicators;
	public ADMINISTRATIVE: IIndicatorInfo;
	public CORRUPTION: IIndicatorInfo;
	public TRANSPARENCY: IIndicatorInfo;
	public TENDER: IIndicatorInfo;
	public GROUPS: Array<IIndicatorInfo>;

	constructor(private i18n: I18NService) {
		this.ADMINISTRATIVE = this.buildIndicatorInfo(this._indicators.ADMINISTRATIVE);
		this.CORRUPTION = this.buildIndicatorInfo(this._indicators.CORRUPTION);
		this.TRANSPARENCY = this.buildIndicatorInfo(this._indicators.TRANSPARENCY);
		this.TENDER = {id: 'TENDER', name: i18n.get('Good Procurement Indicator'), plural: i18n.get('Good Procurement Indicators'), icon: '', subindicators: []};
	}

	private buildIndicatorInfo(ii: IIndicatorInfoConst): IIndicatorInfo {
		return {
			id: ii.id,
			name: this.i18n.getStrict(ii.id + '.name') || ii.name,
			plural: this.i18n.getStrict(ii.id + '.plural') || ii.plural,
			icon: ii.icon,
			subindicators: Object.keys(ii.subindicators)
				.filter(subkey => !ii.subindicators.subindicators[subkey].notused)
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
		this.GROUPS.forEach(group => {
			if (group.id === id) {
				return group;
			}
		});
		return {id: '', name: '', plural: '', icon: '', subindicators: []};
	}

	public getIndicatorInfo(key: string): ISubIndicatorInfo {
		let id = key.split('_')[0];
		this.GROUPS.forEach(group => {
			if (group.id === id) {
				group.subindicators.forEach(sub => {
					if (sub.id === key) {
						return sub;
					}
				});
			}
		});
		return {id: '', name: '', desc: '', order: -1};
	}

	public formatIndicatorName(value: string): string {
		let sub = this.getIndicatorInfo(value);
		if (!sub) {
			return value;
		}
		return sub.name;
	}

}
