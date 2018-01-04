import {enableProdMode, StaticProvider} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {MainModule} from './client.module';
import {getTranslationProviders} from './i18n-providers';

const init = () => {
	getTranslationProviders().then(providers => {
		const options = {providers};
		// here we pass "options.providers" to "platformBrowserDynamic" as extra providers.
		// otherwise when we inject the token TRANSLATIONS it will be empty. The second argument of
		// "bootstrapModule" will assign the providers to the compiler and not our AppModule
		platformBrowserDynamic(<StaticProvider[]>options.providers).bootstrapModule(MainModule, options);
	});
};

enableProdMode();
init();
