import * as moment from 'moment';
import {Consts} from './consts';
import {IChartData} from '../thirdparty/ngx-charts-universal/chart.interface';

export const Utils = {
	formatDatetime: (value: string): string => {
		if (!value || value.length === 0) return '';
		return moment(value).format('DD.MM.YYYY HH:mm');
	},
	formatDate: (value: string): string => {
		if (!value || value.length === 0) return '';
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
		return Utils.formatValue(value); // .toLocaleString();
	},
	formatCurrencyValueEUR: (value: number, fractionSize: number = 2): string => {
		if (value === undefined) {
			return '';
		}
		return '€ ' + Utils.formatValue(value); // .toLocaleString();
	},
	formatIndicatorGroupName(value: string): string {
		if (value === 'CORRUPTION') {
			return 'Corruption Risk Indicator';
		}
		if (value === 'ADMINISTRATIVE') {
			return 'Administrative Capacity Indicator';
		}
		if (value === 'TRANSPARENCY') {
			return 'Transparency Indicator';
		}
		return value;
	},
	formatIndicatorName(value: string): string {
		if (value === undefined || value === null) {
			return '';
		}
		return Utils.expandUnderlined(value.split('_').slice(1).join('_'));
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
		if (value === 'eu') return 'All Countries';
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
	}
};
