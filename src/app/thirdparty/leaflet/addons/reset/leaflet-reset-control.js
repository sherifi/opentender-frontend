import { Control } from '../../../leaflet/control/Control';
import * as DomUtil from '../../dom/DomUtil';
import * as DomEvent from '../../dom/DomEvent';
import {Map} from '../../map/Map';

export var LeafletResetControl = Control.extend({
	options: {
		position: 'topright',
		title: 'Reset Map',
		onClick: null
	},

	onAdd: function(map) {
		var container = DomUtil.create('div', 'leaflet-control-reset leaflet-bar leaflet-control');

		this.link = DomUtil.create('a', 'leaflet-control-reset-button leaflet-bar-part', container);
		DomUtil.create('i', 'icon-target', this.link);
		this.link.href = '#';
		this.link.title = this.options.title;
		this._map = map;
		DomEvent.on(this.link, 'click', this._click, this);
		return container;
	},
	_click: function(e) {
		DomEvent.stopPropagation(e);
		DomEvent.preventDefault(e);
		if (this.options.onClick) {
			this.options.onClick();
		}
	}
});

Map.mergeOptions({
	resetControl: false
});

Map.addInitHook(function() {
	if (this.options.resetControl) {
		this.resetControl = new LeafletResetControl(this.options.resetControl);
		this.addControl(this.resetControl);
	}
});

Control.reset = function(options) {
	return new LeafletResetControl(options);
};
