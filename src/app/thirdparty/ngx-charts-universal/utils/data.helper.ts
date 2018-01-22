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
	return data.map(item => {
		return {
			name: item.name,
			value: item.value,
			id: item.id,
			color: item.color,
			replacement: item.replacement,
			series: item.series ? cloneData(item.series) : undefined
		};
	});
}

// converts all date objects that appear as name into formatted date strings
export function formatDates(data: Array<any>) {
	for (let i = 0; i < data.length; i++) {
		let g = data[i];
		g.name = formatLabel(g.name);
		if (g.series) {
			for (let j = 0; j < g.series.length; j++) {
				let d = g.series[j];
				d.name = formatLabel(d.name);
			}
		}
	}
}
