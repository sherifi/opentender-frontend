import {Injectable, Inject, TRANSLATIONS} from '@angular/core';
import {I18NHtmlParser, HtmlParser, Xliff} from '@angular/compiler';
import {Consts} from '../model/consts';
import * as i18nlanguages from '../../i18n/languages.json';

declare module '*languages.json' {
	export var enabled: Array<{
		id: string;
		name: string;
	}>;
}

@Injectable()
export class I18NService {
	public languages = i18nlanguages.enabled;
	private _extra;
	private _source: string;
	private _translations: { [name: string]: any };

	constructor(@Inject(TRANSLATIONS) source: string, @Inject('TRANSLATIONS_EXTRA') extra) {
		this._extra = extra;
		this._source = source;
		if (this._source) {
			const xliff = new Xliff();
			this._translations = xliff.load(this._source, '').i18nNodesByMsgId;
		}
		this.init();
	}

	public init() {
		if (!this._translations) {
			return;
		}
		Object.keys(Consts.indicators).forEach(key => {
			Consts.indicators[key].name = this.getStrict(key + '.name') || Consts.indicators[key].name;
			Consts.indicators[key].plural = this.getStrict(key + '.plural') || Consts.indicators[key].plural;
			let subs = Consts.indicators[key].subindicators;
			Object.keys(subs).forEach(subkey => {
				subs[subkey].name = this.getStrict(subkey + '.name') || subs[subkey].name;
				subs[subkey].desc = this.getStrict(subkey + '.desc') || subs[subkey].desc;
			});
		});
	}

	public getPortalName(key: string, default_name: string): string {
		if (key && this._extra) {
			if (this._extra.portals) {
				let result = this._extra.portals[key.toLowerCase()];
				if (result) {
					return result;
				}
			}
			if (this._extra.countries) {
				if (key == 'uk') {
					key = 'gb';
				}
				let result = this._extra.countries[key.toUpperCase()];
				if (result) {
					return result;
				}
			}
		}
		return default_name;
	}

	public get(key: string, interpolation: any[] = []): string {
		return this.getStrict(key, interpolation) || key;
	}

	public getStrict(key: string, interpolation: any[] = []) {
		if (!this._translations) {
			return null;
		}
		let id = key.replace(/ /g, '');
		if (!this._translations[id]) {
			console.log('i18n, untranslated text', key);
			return null;
		}
		let parser = new I18NHtmlParser(new HtmlParser(), this._source);
		let placeholders = this._getPlaceholders(this._translations[id]);
		let parseTree = parser.parse(`<div i18n="@@${id}">content ${this._wrapPlaceholders(placeholders).join(' ')}</div>`, 'someI18NUrl');
		return this._interpolate(parseTree.rootNodes[0]['children'][0].value, this._interpolationWithName(placeholders, interpolation));

	}

	private _getPlaceholders(nodes: any[]): string[] {
		return nodes
			.filter((node) => node.hasOwnProperty('name'))
			.map((node) => `${node.name}`);
	}

	private _wrapPlaceholders(placeholders: string[]): string[] {
		return placeholders.map((node) => `{{${node}}}`);
	}

	private _interpolationWithName(placeholders: string[], interpolation: any[]): { [name: string]: any } {
		let asObj = {};
		placeholders.forEach((name, index) => {
			asObj[name] = interpolation[index];
		});
		return asObj;
	}

	private _interpolate(pattern: string, interpolation: { [name: string]: any }): string {
		let compiled = '';
		compiled += pattern.replace(/{{(\w+)}}/g, function(match, key) {
			if (interpolation[key] && typeof interpolation[key] === 'string') {
				match = match.replace(`{{${key}}}`, interpolation[key]);
			}
			return match;
		});

		return compiled;
	}
}
