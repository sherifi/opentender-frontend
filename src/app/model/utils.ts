import * as moment from 'moment';
import {Consts} from './consts';
import {IChartData} from '../thirdparty/ngx-charts-universal/chart.interface';
import {Indicator, SubIndicator} from '../app.interfaces';

export const Utils = {
	formatDatetime: (value: string): string => {
		if (!value || value.length === 0) {
			return '';
		}
		return moment(value).format('DD.MM.YYYY HH:mm');
	},
	formatDate: (value: string): string => {
		if (!value || value.length === 0) {
			return '';
		}
		return moment(value).format('DD.MM.YYYY');
	},
	formatCurrency: (value: string): string => {
		if (value === undefined || value === null) {
			return '';
		}
		value = value.toUpperCase();
		if (Consts.currencies[value]) {
			return Consts.currencies[value].symbol;
		}
		return value;
	},
	formatCurrencyValue: (value: number, fractionSize: number = 2): string => {
		if (value === undefined) {
			return '';
		}
		return Utils.formatValue(value);
	},
	formatCurrencyValueEUR: (value: number, fractionSize: number = 2): string => {
		if (value === undefined) {
			return '';
		}
		return '€ ' + Utils.formatValue(value);
	},
	getIndicatorInfo(value: string) {
		let sub = Consts.indicators.ADMINISTRATIVE.subindicators[value];
		if (sub) {
			return {group: Consts.indicators.ADMINISTRATIVE, indicator: sub};
		}
		sub = Consts.indicators.CORRUPTION.subindicators[value];
		if (sub) {
			return {group: Consts.indicators.CORRUPTION, indicator: sub};
		}
		sub = Consts.indicators.TRANSPARENCY.subindicators[value];
		if (sub) {
			return {group: Consts.indicators.TRANSPARENCY, indicator: sub};
		}
		return null;
	},
	formatIndicatorGroupName(value: string): string {
		let group = Object.keys(Consts.indicators).find(key => {
			return key === Consts.indicators[key].prefix;
		});
		if (Consts.indicators[group]) {
			return Consts.indicators[group].name;
		}
		return value;
	},
	formatIndicatorName(value: string): string {
		let sub = Consts.indicators.ADMINISTRATIVE.subindicators[value] || Consts.indicators.CORRUPTION.subindicators[value] || Consts.indicators.TRANSPARENCY.subindicators[value];
		if (!sub) {
			return value;
		}
		return sub.name;
	},
	getIndicatorDesc(value: string): string {
		let sub = Consts.indicators.ADMINISTRATIVE.subindicators[value] || Consts.indicators.CORRUPTION.subindicators[value] || Consts.indicators.TRANSPARENCY.subindicators[value];
		if (!sub) {
			return '';
		}
		return sub.desc;
	},
	indicatorShortID(key: string): string {
		return key.split('_').map(part => {
			return part[0].toUpperCase();
		}).join('');
	},
	subindicators(indicatorId: string): Array<SubIndicator> {
		return Object.keys(Consts.indicators[indicatorId].subindicators).map(subkey => {
			let sub = Consts.indicators[indicatorId].subindicators[subkey];
			return {
				id: subkey,
				sid: Utils.indicatorShortID(subkey),
				name: sub.name,
				desc: sub.desc
			};
		});
	},
	indicators(): Array<Indicator> {
		return Object.keys(Consts.indicators).map(key => {
			let ii = Consts.indicators[key];
			return {
				id: ii.prefix,
				sid: key,
				name: ii.name,
				plural: ii.plural,
				icon: ii.icon,
				subindicators: Utils.subindicators(key)
			};
		});
	},
	expandUnderlined(value: string): string {
		if (value === undefined || value === null) {
			return '';
		}
		return value.split('_').map(t => {
			return t[0].toUpperCase() + t.slice(1).toLowerCase();
		}).join(' ');
	},
	capitalize(value: string): string {
		if (value === undefined || value === null) {
			return '';
		}
		return value[0].toUpperCase() + value.slice(1);
	},
	expandCountry(value: string): string {
		if (value === undefined || value === null) {
			return '';
		}
		if (value === 'eu') {
			return 'All Countries';
		}
		value = value.toUpperCase();
		if (Consts.countries[value]) {
			return Consts.countries[value];
		}
		return value;
	},
	formatPercent(value): string {
		value = Math.round(value * 100) / 100;
		return value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2}) + '%';
	},
	formatPercentTrunc(value): string {
		return value.toFixed(0) + '%';
	},

	validateNutsCode(code, level) {
		if (code.length > 1 && code.length < 6) {
			code = code.toUpperCase();
			if (code.match(/[A-Z]{2}[A-Z0-9]{0,3}/)) {
				return code.slice(0, 2 + level);
			}
		}
		return 'invalid';
	},

	formatTrunc(value): string {
		return value.toFixed(0);
	},
	formatYear(value): string {
		return value.toString();
	},
	formatValue(n: number) {
		if (n === null || n === undefined) {
			return '';
		}
		if (n >= 1e6) {
			// http://bmanolov.free.fr/numbers_names.php
			let units =
				['Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion', 'Sextillion', 'Septillion', 'Octillion',
					'Nonillion', 'Decillion', 'Undecillion', 'Duodecillion', 'Tredecillion', 'Quattuordecillion', 'Quindecillion',
					'Sexdecillion', 'Septdecillion', 'Octodecillion', 'Novemdecillion', 'Vigintillion'];
			let real_si = Math.round(Math.log(n) * Math.LOG10E);
			let base_si = real_si - (real_si % 3);
			let unit = units[Math.floor(base_si / 3) - 2];
			let r = n / parseFloat('1e' + base_si);
			let r_string = r.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1});
			return r_string + ' ' + unit;
		}
		return n.toLocaleString();
	},
	seriesToTable(data: IChartData[], header) {
		let hasID = header.hasOwnProperty('id');
		let list = data.map(d => {
			return hasID ? [d.id, d.name, d.value] : [d.name, d.value];
		});
		return {rows: list, head: hasID ? [header.id, header.name, header.value] : [header.name, header.value]};
	},
	downloadSeries: function(format, data, header, exportfilename) {
		if (format === 'csv') {
			Utils.downloadCSVSeries(data, header, exportfilename);
		} else if (format === 'json') {
			Utils.downloadJSON({fields: header, data: data}, exportfilename);
		}
	},
	downloadCSVSeries(data: IChartData[], header, exportfilename: string) {
		let hasID = header.hasOwnProperty('id');
		let list = data.map(d => {
			return JSON.stringify(hasID ? [d.id, d.name, d.value] : [d.name, d.value]);
		});
		list.unshift(JSON.stringify(hasID ? [header.id, header.name, header.value] : [header.name, header.value]));
		let csv = list.join('\n').replace(/(^\[)|(\]$)/mg, ''); // remove opening [ and closing ] brackets from each line
		Utils.downloadCSV(csv, exportfilename);
	},
	downloadCSV: function(csvString, exportfilename) {
		Utils.downloadBlob(csvString, exportfilename, 'csv', 'text/csv;charset=utf8;');
	},
	downloadJSON: function(obj, exportfilename) {
		Utils.downloadBlob(JSON.stringify(obj, null, '\t'), exportfilename, 'json', 'application/json');
	},
	downloadBlob: function(string, exportfilename, ext, type) {
		const blob = new Blob([string], {'type': type});
		const filename = exportfilename.toLowerCase().replace(/ /g, '_') + '.' + ext;
		if (window.navigator.msSaveOrOpenBlob) { // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
			window.navigator.msSaveBlob(blob, filename);
		} else {
			const a = window.document.createElement('a');
			a.href = window.URL.createObjectURL(blob);
			a.download = filename;
			a.textContent = 'Download ' + filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	},
	cpv2color: function(cpv) {
		if (cpv.length == 2) {
			return Consts.colors.diverging[parseInt(cpv, 10)];
		}
		if (cpv.length == 3) {
			let i = parseInt(cpv.slice(2, 3), 10);
			let parentcolor = Utils.cpv2color(cpv.slice(0, 2));
			if (i === 0) {
				// zero id'd "child" is in fact the parent, so use that color
				return parentcolor;
			}
			if (Consts.colors.diverging[i] === parentcolor) {
				// switcheroo if using the same color as the parent
				return Consts.colors.diverging[0];
			}
			return Consts.colors.diverging[i];
		}
		if (cpv.length == 5) {
			let i = parseInt(cpv.slice(3, 5), 10);
			let parentcolor = Utils.cpv2color(cpv.slice(0, 3));
			if (i === 0) {
				return parentcolor;
			}
			if (Consts.colors.diverging[i] === parentcolor) {
				return Consts.colors.diverging[0];
			}
			return Consts.colors.diverging[i];
		}
		return '#fff';
	},
	roundValueTwoDecimals: (value) => {
		return Math.round(value * 100) / 100;
	},
	scrollToFirst: (className: string) => {
		let elements = document.getElementsByClassName(className);
		if (elements.length == 0) {
			return;
		}
		elements[0].scrollIntoView();
	}
};
