// import 'core-js/client/shim'; // support for internet explorer 11
// import 'classlist.js'; // support for internet explorer 11
//
// import 'zone.js/dist/zone';
// import 'reflect-metadata';
// import 'rxjs/Observable';
// import 'rxjs/add/operator/map';


import {enableProdMode, Provider} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {MainModule} from './main.module';
import {getTranslationProviders} from './i18n-providers';

enableProdMode();

getTranslationProviders().then(providers => {
	const options = {providers};
	// here we pass "options.providers" to "platformBrowserDynamic" as extra providers.
	// otherwise when we inject the token TRANSLATIONS it will be empty. The second argument of
	// "bootstrapModule" will assign the providers to the compiler and not our AppModule
	platformBrowserDynamic(<Provider[]>options.providers).bootstrapModule(MainModule, options);
});


// platformBrowserDynamic().bootstrapModule(MainModule);

// // on document ready bootstrap Angular 2
// document.addEventListener('DOMContentLoaded', () => {
// 	getTranslationProviders().then(providers => {
// 		const options = { providers };
// 		platformRef.bootstrapModule(MainModule, options);
// 	});
// });
