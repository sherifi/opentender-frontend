import * as moment from 'moment';

export function yearOf(v: any): number {
	return moment(v).year();
}

export function toDate(v: any): Date {
	return moment(v).toDate();
}

export function isDate(v: any): boolean {
	return (v instanceof Date);
// 	return (v.constructor.name === 'Date');
}
