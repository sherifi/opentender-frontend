import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

enableProdMode();

import {MainModule} from './main.module';

// import { getTranslationProviders } from './i18n-providers';

platformBrowserDynamic().bootstrapModule(MainModule);

// // on document ready bootstrap Angular 2
// document.addEventListener('DOMContentLoaded', () => {
// 	getTranslationProviders().then(providers => {
// 		const options = { providers };
// 		platformRef.bootstrapModule(MainModule, options);
// 	});
// });
