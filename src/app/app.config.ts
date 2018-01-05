import {CommonModule} from '@angular/common';
import {ToastrModule} from 'ngx-toastr';
import {AppRoutingModule} from './app.routes';

import {PipesModule} from './modules/pipes/pipes.module';
import {I18nModule} from './modules/i18n/i18n.module';
import {MapsModule} from './modules/maps/maps.module';

import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {LoadingComponent} from './components/loading/loading.component';

import {StartPage} from './pages/start/start.component';
import {HomePage} from './pages/home/home.component';
import {TestPage} from './pages/test/test.component';

import {PageScrollDirective} from './directives/page-scroll.directive';

import {IndicatorService} from './services/indicator.service';
import {ConfigService} from './services/config.service';
import {NotifyService} from './services/notify.service';
import {ApiService} from './services/api.service';
import {StateService} from './services/state.service';
import {PlatformService} from './services/platform.service';
import {Title} from '@angular/platform-browser';
import {TitleService} from './services/title.service';
import {GraphsBarModule} from './modules/graphs/bar/graphs-bar.module';

const AppConfig = {
	declarations: [
		AppComponent,
		FooterComponent,
		HeaderComponent,
		LoadingComponent,
		HomePage,
		StartPage,
		TestPage,
		PageScrollDirective
	],
	imports: [
		CommonModule,
		I18nModule,
		MapsModule,
		GraphsBarModule,
		PipesModule,
		ToastrModule.forRoot(),
		AppRoutingModule
	],
	providers: [
		TitleService,
		ConfigService,
		StateService,
		PlatformService,
		IndicatorService,
		NotifyService,
		Title,
		ApiService
	]
};

export {AppConfig};
