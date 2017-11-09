import * as countries from './countries.json';
import * as currencies from './currencies.json';
import * as indicators from './indicators.json';

export interface ISubIndicatorInfoConst {
	id: string;
	name: string;
	desc: string;
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

export const Consts = {
	indicators: indicators,
	countries: countries,
	currencies: currencies,
	IPSUM: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
	colors: {
		diverging: [
			'#bf9d76',
			'#e99450',
			'#7794b1',
			'#f2dfa7',
			'#a5d7c6',
			'#afafaf',
			'#707160',
			'#ba9383',
			'#d9d5c3',
			'#8c510a',
			'#bf812d',
			'#dfc27d',
			'#f6e8c3',
			'#c7eae5',
			'#80cdc1',
			'#35978f',
			'#01665e',
			'#003c30',
			//
			'#c1eb44',
			'#210887',
			'#3eed95',
			'#8e4fe2',
			'#8bb421',
			'#0135aa',
			'#ffdd53',
			'#0263db',
			'#eea714',
			'#12af55',
			'#e91388',
			'#038839',
			'#ff61d0',
			'#608f00',
			'#5f349b',
			'#f5f7a4',
			'#bfd17f',
			'#1e327f',
			'#bc7d14',
			'#0d91f5',
			'#bb0c06',
			'#18f9f7',
			'#fa5b3e',
			'#800905',
			'#02d8d6',
			'#a71158',
			'#8ffbfb',
			'#640312',
			'#42d9fd',
			'#c34d37',
			'#0abbfc',
			'#976519',
			'#e494fc',
			'#4d7607',
			'#966fc4',
			'#135404',
			'#ef66a5',
			'#196d3f',
			'#f6b0fb',
			'#00360b',
			'#f797c4',
			'#012403',
			'#f5c8f6',
			'#f4f0cd',
			'#aff4cb',
			'#6e0c3b',
			'#20bcbb',
			'#450001',
			'#cef4f6',
			'#3c0318',
			'#fce8f9',
			'#061807',
			'#f6d2bc',
			'#0c2555',
			'#e3b572',
			'#00478d',
			'#f18d71',
			'#106eb7',
			'#663501',
			'#58a9f0',
			'#294304',
			'#a9cae8',
			'#451205',
			'#1d9cc2',
			'#854335',
			'#129c9b',
			'#fdb696',
			'#b8c8b2',
			'#361f13',
			'#e4becd',
			'#bc8398',
			'#bda096',
			'#084246',
			'#9c5371',
			'#6aaa83',
			'#533a4a',
			'#7b8b44',
			'#22547e',
			'#5e441e',
			'#237dab',
			'#956c62',
			'#157e7f',
			'#897aa4',
			'#24382c',
			'#89adb1',
			'#234153',
			'#8a8a71',
			'#0a6062',
			'#847682',
			'#525c47',
			'#567681'
		],
		single: ['#4e99ca'],
		single2: ['#2b908f'],
		single3: ['#dfc27d'],
		single4: ['#e99450']
	}
};
