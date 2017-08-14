import {TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID} from '@angular/core';

export function getTranslationProviders(): Promise<Object[]> {
	const noProviders: Object[] = [];
	const config = document['opentender'];
	if (!config || !config.locale || config.locale === 'en') {
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
							{provide: LOCALE_ID, useValue: config.locale}
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
		xhr.open('GET', '/assets/lang/' + config.locale, true);
		xhr.send();
	});
	return promise;
}
