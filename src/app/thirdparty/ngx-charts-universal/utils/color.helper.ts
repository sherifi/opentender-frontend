import {scaleBand, scaleLinear, scaleOrdinal, scaleQuantile} from 'd3-scale';
import {range} from 'd3-array';

export class ColorHelper {
	scale: any;
	scaleType: any;
	colorDomain: any[];
	domain: any;
	customColors: any;

	constructor(scheme, type, domain, customColors?) {
		this.colorDomain = scheme.domain;
		this.scaleType = type;
		this.domain = domain;

		this.scale = this.generateColorScheme(scheme, type, domain);
	}

	generateColorScheme(scheme, type, domain) {
		let colorScale;
		if (type === 'quantile') {
			colorScale = scaleQuantile()
				.range(scheme.domain)
				.domain(domain);

		} else if (type === 'ordinal') {
			colorScale = scaleOrdinal()
				.range(scheme.domain)
				.domain(domain);

		} else { // if (type === 'linear') {
			colorScale = scaleLinear()
				.domain(range(0, 1, 1.0 / (scheme.domain.length - 1)))
				.range(scheme.domain);
		}

		return colorScale;
	}

	getColor(value) {
		if (this.scaleType === 'linear') {
			let valueScale = scaleLinear()
				.domain(this.domain)
				.range([0, 1]);

			return (this.scale(valueScale(value)));
		} else {
			let formattedValue = value.toString();
			let found: any = undefined; // todo type customColors
			if (this.customColors && this.customColors.length > 0) {
				found = this.customColors.find((mapping) => {
					return mapping.name === formattedValue.toLowerCase();
				});
			}

			if (found) {
				return found.value;
			} else {
				return this.scale(value);
			}
		}
	}

	getLinearGradientStops(value, start) {
		if (!start) {
			start = this.domain[0];
		}

		let valueScale = scaleLinear()
			.domain(this.domain)
			.range([0, 1]);

		let colorValueScale = scaleBand()
			.domain(this.colorDomain)
			.range([0, 1]);

		let endColor = this.getColor(value);

		// generate the stops
		let startVal = valueScale(start);
		let startColor = this.getColor(start);

		let endVal = valueScale(value);
		let i = 0;
		let currentVal = startVal;
		let stops = [];
		stops.push({
			color: startColor,
			offset: 0,
			opacity: 1
		});

		while (currentVal < endVal && i < this.colorDomain.length) {
			let color = this.colorDomain[i];
			let offset = colorValueScale(color);
			if (offset <= startVal) {
				i++;
				continue;
			}
			if (offset >= endVal) {
				break;
			}

			stops.push({
				color: color,
				offset: offset,
				opacity: 1
			});
			currentVal = offset;
			i++;
		}

		stops.push({
			color: endColor,
			offset: endVal,
			opacity: 1
		});

		// normalize the offsets into percentages
		for (let s of stops) {
			s.offset = Math.floor(((s.offset - startVal) / (endVal - startVal)) * 100);
		}

		return stops;
	}
}

/**
 * Converts a hex to RGB
 * http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 *
 * @export
 * @param {string} hex
 * @returns {*}
 */
export function hexToRgb(hex: string): any {
	const result =
		hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
			, (m, r, g, b) => '#' + r + r + g + g + b + b)
			.substring(1).match(/.{2}/g)
			.map(x => parseInt(x, 16));

	return {
		r: result[0],
		g: result[1],
		b: result[2]
	};
}

/**
 * Accepts a hex color and returns a inverted hex color
 * http://stackoverflow.com/questions/9600295/automatically-change-text-color-to-assure-readability
 *
 * @export
 * @param {any} color
 * @returns {string}
 */
export function invertColor(hex): any {
	const {r, g, b} = hexToRgb(hex);
	const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
	const darken = (yiq >= 128);
	const depth = darken ? -.8 : .8;

	return shadeRGBColor({r, g, b}, depth);
}

/**
 * Given a rgb, it will darken/lighten
 * http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
 *
 * @export
 * @param {any} { r, g, b }
 * @param {any} percent
 * @returns
 */
export function shadeRGBColor({r, g, b}, percent) {
	const t = percent < 0 ? 0 : 255;
	const p = percent < 0 ? percent * -1 : percent;

	r = (Math.round((t - r) * p) + r);
	g = (Math.round((t - g) * p) + g);
	b = (Math.round((t - b) * p) + b);

	return `rgb(${r}, ${g}, ${b})`;
}
