import {enableProdMode, StaticProvider} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {MainModule} from './client.module';
import {getTranslationProviders} from './i18n-providers';
import {environment} from '../environments/environment';
import {MissingTranslationStrategy} from '@angular/core';

const init = () => {
	getTranslationProviders().then(providers => {
		platformBrowserDynamic(<StaticProvider[]>providers).bootstrapModule(MainModule, {
			missingTranslation: environment.production ? MissingTranslationStrategy.Ignore : MissingTranslationStrategy.Warning,
			providers
		});
	});
};
if (environment.production) {
	enableProdMode();
}

init();
