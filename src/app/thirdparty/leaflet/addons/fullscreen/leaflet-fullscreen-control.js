import { Control } from '../../../leaflet/control/Control';
import * as DomUtil from '../../dom/DomUtil';
import * as DomEvent from '../../dom/DomEvent';
import {Map} from '../../map/Map';
import * as Util from '../../core/Util';

export var LeafletFullscreenControl = Control.extend({
	options: {
		position: 'topleft',
		title: {
			'false': 'View Fullscreen',
			'true': 'Exit Fullscreen'
		}
	},

	onAdd: function(map) {
		var container = DomUtil.create('div', 'leaflet-control-fullscreen leaflet-bar leaflet-control');

		this.link = DomUtil.create('a', 'leaflet-control-fullscreen-button leaflet-bar-part', container);
		this.link.href = '#';

		this._map = map;
		this._map.on('fullscreenchange', this._toggleTitle, this);
		this._toggleTitle();

		DomEvent.on(this.link, 'click', this._click, this);

		return container;
	},

	_click: function(e) {
		DomEvent.stopPropagation(e);
		DomEvent.preventDefault(e);
		this._map.toggleFullscreen(this.options);
	},

	_toggleTitle: function() {
		this.link.title = this.options.title[this._map.isFullscreen()];
	}
});

Map.include({
	isFullscreen: function() {
		return this._isFullscreen || false;
	},

	toggleFullscreen: function(options) {
		var container = this.getContainer();
		if (this.isFullscreen()) {
			if (options && options.pseudoFullscreen) {
				this._disablePseudoFullscreen(container);
			} else if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document['mozCancelFullScreen']) {
				document['mozCancelFullScreen']();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			} else if (document['msExitFullscreen']) {
				document['msExitFullscreen']();
			} else {
				this._disablePseudoFullscreen(container);
			}
		} else {
			if (options && options.pseudoFullscreen) {
				this._enablePseudoFullscreen(container);
			} else if (container.requestFullscreen) {
				container.requestFullscreen();
			} else if (container.mozRequestFullScreen) {
				container.mozRequestFullScreen();
			} else if (container.webkitRequestFullscreen) {
				container.webkitRequestFullscreen(Element['ALLOW_KEYBOARD_INPUT']);
			} else if (container.msRequestFullscreen) {
				container.msRequestFullscreen();
			} else {
				this._enablePseudoFullscreen(container);
			}
		}

	},

	_enablePseudoFullscreen: function(container) {
		DomUtil.addClass(container, 'leaflet-pseudo-fullscreen');
		this._setFullscreen(true);
		this.fire('fullscreenchange');
	},

	_disablePseudoFullscreen: function(container) {
		DomUtil.removeClass(container, 'leaflet-pseudo-fullscreen');
		this._setFullscreen(false);
		this.fire('fullscreenchange');
	},

	_setFullscreen: function(fullscreen) {
		this._isFullscreen = fullscreen;
		var container = this.getContainer();
		if (fullscreen) {
			DomUtil.addClass(container, 'leaflet-fullscreen-on');
		} else {
			DomUtil.removeClass(container, 'leaflet-fullscreen-on');
		}
		this.invalidateSize();
	},

	_onFullscreenChange: function(e) {
		var fullscreenElement =
			document.fullscreenElement ||
			document['mozFullScreenElement'] ||
			document.webkitFullscreenElement ||
			document['msFullscreenElement'];

		if (fullscreenElement === this.getContainer() && !this._isFullscreen) {
			this._setFullscreen(true);
			this.fire('fullscreenchange');
		} else if (fullscreenElement !== this.getContainer() && this._isFullscreen) {
			this._setFullscreen(false);
			this.fire('fullscreenchange');
		}
	}
});

Map.mergeOptions({
	fullscreenControl: false
});

Map.addInitHook(function() {
	if (this.options.fullscreenControl) {
		this.fullscreenControl = new LeafletFullscreenControl(this.options.fullscreenControl);
		this.addControl(this.fullscreenControl);
	}

	var fullscreenchange;

	if ('onfullscreenchange' in document) {
		fullscreenchange = 'fullscreenchange';
	} else if ('onmozfullscreenchange' in document) {
		fullscreenchange = 'mozfullscreenchange';
	} else if ('onwebkitfullscreenchange' in document) {
		fullscreenchange = 'webkitfullscreenchange';
	} else if ('onmsfullscreenchange' in document) {
		fullscreenchange = 'MSFullscreenChange';
	}

	if (fullscreenchange) {
		var onFullscreenChange = Util.bind(this._onFullscreenChange, this);

		this.whenReady(function() {
			DomEvent.on(document, fullscreenchange, onFullscreenChange);
		});

		this.on('unload', function() {
			DomEvent.off(document, fullscreenchange, onFullscreenChange);
		});
	}
});

Control.fullscreen = function(options) {
	return new LeafletFullscreenControl(options);
};
