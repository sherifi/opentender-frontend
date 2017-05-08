import * as array from 'd3-array';
import * as color from 'd3-color';
import * as brush from 'd3-brush';
import * as force from 'd3-force';
import * as interpolate from 'd3-interpolate';
import * as format from 'd3-format';
import * as scales from 'd3-scale';
import * as selection from 'd3-selection';
import * as shape from 'd3-shape';
import * as hierarchy from 'd3-hierarchy';
import {Selection, select} from 'd3-selection'; // not unused, typescript needs them to apply bindings, yet there are not used in the code
import {transition} from 'd3-transition'; // not unused!

export default {
	arc: shape.arc,
	area: shape.area,
	brush: brush.brush,
	brushX: brush.brushX,
	brushY: brush.brushY,
	event: selection.event,
	extent: array.extent,
	forceCollide: force.forceCollide,
	forceLink: force.forceLink,
	forceManyBody: force.forceManyBody,
	forceSimulation: force.forceSimulation,
	forceX: force.forceX,
	forceY: force.forceY,
	format: format.format,
	interpolate: interpolate.interpolate,
	line: shape.line,
	max: array.max,
	min: array.min,
	mouse: selection.mouse,
	pie: shape.pie,
	range: array.range,
	rgb: color.rgb,
	selection: selection,
	select: selection.select,
	selectAll: selection.selectAll,
	scaleBand: scales.scaleBand,
	scaleLinear: scales.scaleLinear,
	scaleOrdinal: scales.scaleOrdinal,
	scalePoint: scales.scalePoint,
	scaleQuantile: scales.scaleQuantile,
	scaleTime: scales.scaleTime,
	shape: shape,
	treemap: hierarchy.treemap,
	stratify: hierarchy.stratify
};
