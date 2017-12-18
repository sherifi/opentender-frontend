import {TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID, StaticProvider} from '@angular/core';

function getParameterByName(name) {
	let url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
	let results = regex.exec(url);
	if (!results) {
		return null;
	}
	if (!results[2]) {
		return '';
	}
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function getTranslationProviders(): Promise<StaticProvider[]> {
	const noProviders: StaticProvider[] = [
		{provide: TRANSLATIONS, useValue: null},
		{provide: 'TRANSLATIONS_EXTRA', useValue: null}
	];
	const config = document['opentender'];
	let locale: string = null;
	let query_locale = getParameterByName('lang');
	if (query_locale && query_locale.length == 2) {
		locale = query_locale;
		if (locale == 'en') {
			if (window.location.href.split('?')[1]) {
				window.history.replaceState({}, document.title, window.location.href.split('?')[0]);
			}
		}
		if (window.localStorage) {
			window.localStorage.setItem('opentender.lang', locale);
		}
	}
	if (!locale) {
		if (window.localStorage) {
			query_locale = window.localStorage.getItem('opentender.lang');
			if (query_locale) {
				locale = query_locale;
			}
		}
	}
	if (!locale && config && config.locale) {
		locale = config.locale;
	}
	if (!locale || locale === 'en') {
		return Promise.resolve(noProviders);
	}
	// console.log('loading translation', config.locale);
	let promise = new Promise<StaticProvider[]>(function(resolve, reject) {
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					let result = JSON.parse(xhr.response);
					resolve([
							{provide: 'TRANSLATIONS_EXTRA', useValue: result.extra},
							{provide: TRANSLATIONS, useValue: result.translations},
							{provide: TRANSLATIONS_FORMAT, useValue: 'xlf'},
							{provide: LOCALE_ID, useValue: locale}
						]
					);
				} else {
					resolve(noProviders);
				}
			}
		};
		xhr.onerror = function() {
			resolve(noProviders);
		};
		xhr.open('GET', '/assets/lang/' + locale, true);
		xhr.send();
	});
	return promise;
}
