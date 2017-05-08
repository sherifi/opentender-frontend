import {TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID} from '@angular/core';

import {TRANSLATION_DE} from '../i18n/messages.de';
import {TRANSLATION_ES} from '../i18n/messages.es';

let translations = {
	'de': TRANSLATION_DE,
	'es': TRANSLATION_ES
};

export function getTranslationProviders(): Promise<Object[]> {
	const lang = document['locale'] as string;
	const noProviders: Object[] = [];
	let translation = translations[lang];
	if (!translation) {
		return Promise.resolve(noProviders);
	}
	return Promise.resolve([
			{provide: TRANSLATIONS, useValue: translation},
			{provide: TRANSLATIONS_FORMAT, useValue: 'xlf'},
			{provide: LOCALE_ID, useValue: lang}
		]
	);
}
