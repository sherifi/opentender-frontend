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

export function splitLabel(label: string, charCount: number = 20): Array<string> {
	if (label.length > charCount) {
		let result = [''];
		let array = label.split(' ');
		array.forEach(w => {
			let last = result[result.length - 1];
			if (last.length === 0) {
				result[result.length - 1] = w;
			} else if ((last.length + w.length) < charCount) {
				result[result.length - 1] += ' ' + w;
			} else {
				result.push(w);
			}
		});
		return result;
	}
	return [label];
}
