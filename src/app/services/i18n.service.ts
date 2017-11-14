import {Injectable, Inject, TRANSLATIONS} from '@angular/core';
import {I18NHtmlParser, HtmlParser, Xliff} from '@angular/compiler';

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

	public get(key: string, interpolation: any[] = []): string {
		if (!this._translations) {
			return key;
		}
		let id = key.replace(/ /g, '');
		if (!this._translations[id]) {
			console.log('i18n, untranslated text', key);
			return key;
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
