export interface IDomain extends Array<string|Date|number> {
}

export interface ILegendOptions {
	scaleType: string;
	domain: IDomain;
	colors: any;
}
