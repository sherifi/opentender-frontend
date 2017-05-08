import  * as moment from 'moment';
import {Consts} from './consts';

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
		if (value === undefined) return '';
		const PADDING = '000000';
		const DECIMAL_SEPARATOR = ',';
		const THOUSANDS_SEPARATOR = '.';
		let [integer, fraction = ''] = (value || '').toString().split('.');
		fraction = fractionSize > 0 ? DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize) : '';
		integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);
		if (integer.length === 0) integer = '0';
		return integer + fraction;
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
	}

};
