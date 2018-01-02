import {ColorHelper} from '../utils/color.helper';

export interface IDomain extends Array<string|Date|number> {
}

export interface ILegendOptions {
	domain: IDomain;
	colors: ColorHelper;
}
