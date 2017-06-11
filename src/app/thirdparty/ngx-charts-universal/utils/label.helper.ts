/**
 * Formats a label given a date, number or string.
 *
 * @export
 * @param {*} label
 * @returns {string}
 */
export function formatLabel(label: any): string {
	if (label instanceof Date) {
		label = label.toLocaleDateString();
	} else {
		label = label.toLocaleString();
	}

	return label;
}

export function trimLabel(s, max = 16): string {
	if (typeof s !== 'string') {
		if (typeof s === 'number') {
			return s + '';
		} else {
			return '';
		}
	}

	if (s.length <= max) {
		return s;
	} else {
		return `${s.slice(0, max).trim()}…`;
	}
}
