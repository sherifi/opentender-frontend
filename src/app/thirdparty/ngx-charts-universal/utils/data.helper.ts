import {formatLabel} from './label.helper';
import {IChartData} from '../chart.interface';

/**
 * Clones the data into a new object
 *
 * @private
 * @param {any} data
 * @returns {*}
 *
 * @memberOf BaseChart
 */
export function cloneData(data: Array<IChartData>): Array<IChartData> {
	let results = [];

	for (let item of data) {
		let copy = {
			name: item['name']
		};

		if (item['value'] !== undefined) {
			copy['value'] = item['value'];
		}

		if (item['id'] !== undefined) {
			copy['id'] = item['id'];
		}

		if (item['series'] !== undefined) {
			copy['series'] = cloneData(item['series']);
		}

		results.push(copy);
	}

	return results;
}

// converts all date objects that appear as name into formatted date strings
export function formatDates(data: Array<any>) {
	for (let i = 0; i < data.length; i++) {
		let g = this.data[i];
		g.name = formatLabel(g.name);
		if (g.series) {
			for (let j = 0; j < g.series.length; j++) {
				let d = g.series[j];
				d.name = formatLabel(d.name);
			}
		}
	}
}
