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
		if (value === undefined) {
			return '';
		}
		return value.toLocaleString();
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
