import {TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID} from '@angular/core';

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

export function getTranslationProviders(): Promise<Object[]> {
	const noProviders: Object[] = [{
		provide: TRANSLATIONS, useValue: null
	}];
	const config = document['opentender'];
	let locale: string = null;
	let query_locale = getParameterByName('lang');
	if (query_locale && query_locale.length == 2) {
		locale = query_locale;
	}
	if (!locale && config && config.locale) {
		locale = config.locale;
	}
	if (!locale || locale === 'en') {
		return Promise.resolve(noProviders);
	}
	// console.log('loading translation', config.locale);
	let promise = new Promise<Object[]>(function(resolve, reject) {
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					let translation = xhr.response;
					resolve([
							{provide: TRANSLATIONS, useValue: translation},
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
