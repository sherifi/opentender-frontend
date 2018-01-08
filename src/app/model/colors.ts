import {IColorScaleType, IColorSet} from '../thirdparty/ngx-charts-universal/chart.interface';

const colors = {
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
	dual: ['#4e99ca', '#2b908f'],
	single: ['#4e99ca'],
	single2: ['#2b908f'],
	single3: ['#dfc27d'],
	single4: ['#e99450'],
	redgreen: ['#ff0000', '#fffa4b', '#008000'],
	indicators: {
		'ADMINISTRATIVE': '#80aa6a',
		'INTEGRITY': '#4c959d',
		'TRANSPARENCY': '#8e9d63',
		'TENDER': '#0e9720'
	}
};

export function cpv2color(cpv: string) {
	if (cpv.length == 2) {
		return colors.diverging[parseInt(cpv, 10)];
	}
	if (cpv.length == 3) {
		let i = parseInt(cpv.slice(2, 3), 10);
		let parentcolor = cpv2color(cpv.slice(0, 2));
		if (i === 0) {
			// zero id'd "child" is in fact the parent, so use that color
			return parentcolor;
		}
		if (colors.diverging[i] === parentcolor) {
			// switcheroo if using the same color as the parent
			return colors.diverging[0];
		}
		return colors.diverging[i];
	}
	if (cpv.length == 5) {
		let i = parseInt(cpv.slice(3, 5), 10);
		let parentcolor = cpv2color(cpv.slice(0, 3));
		if (i === 0) {
			return parentcolor;
		}
		if (colors.diverging[i] === parentcolor) {
			return colors.diverging[0];
		}
		return colors.diverging[i];
	}
	return '#fff';
}

const schemes: { [name: string]: IColorSet } = {
	ordinal_1: {
		scaleType: IColorScaleType.Ordinal,
		range: colors.single
	},
	ordinal_2: {
		scaleType: IColorScaleType.Ordinal,
		range: colors.single2
	},
	ordinal_3: {
		scaleType: IColorScaleType.Ordinal,
		range: colors.single3
	},
	ordinal_4: {
		scaleType: IColorScaleType.Ordinal,
		range: colors.single4
	},
	ordinal_dual: {
		scaleType: IColorScaleType.Ordinal,
		range: colors.dual
	},
	ordinal_diverging: {
		scaleType: IColorScaleType.Ordinal,
		range: colors.diverging
	},
	linear_red_green: {
		scaleType: IColorScaleType.Linear,
		range: colors.redgreen,
		fixedDomain: [0, 50, 99]
	},
	ordinal_cpvs: {
		scaleType: IColorScaleType.Ordinal,
		range: colors.diverging,
		getColor: (value) => {
			return cpv2color(value.toString());
		}
	}
};

export const Colors = {
	colors: colors,
	colorSchemes: schemes,
	cpv2color: cpv2color
};
