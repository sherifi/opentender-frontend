import {Injectable, Inject, TRANSLATIONS} from '@angular/core';
import {I18NHtmlParser, HtmlParser, Xliff} from '@angular/compiler';
import {routes} from '../app.routes';
import {Consts} from '../model/consts';

@Injectable()
export class I18NService {
	private _source: string;
	private _translations: { [name: string]: any };

	constructor(@Inject(TRANSLATIONS) source: string) {
		this._source = source;
		if (this._source) {
			const xliff = new Xliff();
			this._translations = xliff.load(this._source, '').i18nNodesByMsgId;
		}
	}

	private translateRoute(route): void {
		if (route.data) {
			if (route.data.title) {
				route.data.title = this.get(route.data.title);
			}
			if (route.data.menu_title) {
				route.data.menu_title = this.get(route.data.menu_title);
			}
		}
		if (route.children) {
			route.children.forEach(sub => this.translateRoute(sub));
		}
	}

	public init() {
		if (!this._translations) {
			return;
		}
		routes.forEach(route => this.translateRoute(route));
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
