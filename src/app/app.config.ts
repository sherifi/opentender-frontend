import {CommonModule} from '@angular/common';
import {DownloadSeriesModule} from './components/download-series/download-series.module';
import {DialogModule} from './components/dialog/dialog.module';
import {CommonTooltipModule} from './thirdparty/ngx-charts-universal/common/tooltip/common-tooltip.module';
import {AppRoutingModule} from './app.routes';
import {PipesModule} from './components/pipes/pipes.module';
import {FormsModule} from '@angular/forms';
import {GraphModule} from './components/graphs/graphs.module';
import {ToastrModule} from 'ngx-toastr';
import {SliderModule} from './components/slider/silder.module';
import {TableModule} from './components/tables/table.module';
import {I18nModule} from './components/i18n/i18n.module';
import {AppComponent} from './app.component';
import {MapBuyersComponent} from './components/maps/nuts-map-buyer.component';
import {SelectSimilarListComponent} from './components/selects/similar-list/select-similar-list.component';
import {CollapseExpandComponent, TenderBodyAddressComponent, TenderBodyComponent, TenderBodyLineComponent, TenderPriceComponent} from './components/tender.components';
import {DashboardsIndicatorComponent} from './components/dashboard/indicator-dashboard.component';
import {NUTSMapComponent} from './components/maps/nuts-map.component';
import {StartPage} from './pages/start/start.component';
import {HeaderComponent} from './components/header/header.component';
import {MapComponent} from './components/maps/leaflet.component';
import {MapPortalComponent} from './components/maps/nuts-map-portal.component';
import {CompanyPage} from './pages/company/company.component';
import {PageScrollDirective} from './directives/page-scroll.directive';
import {TestPage} from './pages/test/test.component';
import {SectorPage} from './pages/sector/sector.component';
import {LoadingComponent} from './components/loading/loading.component';
import {HomePage} from './pages/home/home.component';
import {MapHomeComponent} from './components/maps/nuts-map-home.component';
import {AuthorityPage} from './pages/authority/authority.component';
import {DownloadPage} from './pages/download/download.component';
import {DashboardsMarketAnalysisPage} from './pages/dashboards/market-analysis/market-analysis.component';
import {ImprintPage} from './pages/imprint/imprint.component';
import {DashboardsAdministrativeCapacityPage} from './pages/dashboards/administrative-capacity/administrative-capacity.component';
import {MapSuppliersComponent} from './components/maps/nuts-map-supplier.component';
import {I18NComponent} from './components/i18n.component';
import {DashboardsTransparencyPage} from './pages/dashboards/transparency/transparency.component';
import {RegionPage} from './pages/region/region.component';
import {TenderPage} from './pages/tender/tender.component';
import {DashboardsIntegrityPage} from './pages/dashboards/procurement-integrity/procurement-integrity.component';
import {DashboardsPage} from './pages/dashboards/dashboards.component';
import {MapVolumeComponent} from './components/maps/nuts-map-volume.component';
import {FooterComponent} from './components/footer/footer.component';
import {SelectYearRangeComponent} from './components/selects/year-range/select-year-range.component';
import {IndicatorService} from './services/indicator.service';
import {ConfigService} from './services/config.service';
import {NotifyService} from './services/notify.service';
import {ApiService} from './services/api.service';
import {StateService} from './services/state.service';
import {PlatformService} from './services/platform.service';
import {Title} from '@angular/platform-browser';
import {TitleService} from './services/title.service';

const AppConfig = {
	declarations: [
		AppComponent,
		CollapseExpandComponent,
		FooterComponent,
		HeaderComponent,
		LoadingComponent,
		MapComponent,
		NUTSMapComponent,
		MapHomeComponent,
		MapPortalComponent,
		MapSuppliersComponent,
		MapBuyersComponent,
		MapVolumeComponent,
		SelectYearRangeComponent,
		SelectSimilarListComponent,
		TenderBodyAddressComponent,
		TenderBodyComponent,
		TenderBodyLineComponent,
		TenderPriceComponent,
		DashboardsIndicatorComponent,

		I18NComponent,

		AuthorityPage,
		CompanyPage,
		DownloadPage,
		DashboardsAdministrativeCapacityPage,
		DashboardsIntegrityPage,
		DashboardsPage,
		DashboardsMarketAnalysisPage,
		DashboardsTransparencyPage,
		HomePage,
		ImprintPage,
		RegionPage,
		SectorPage,
		StartPage,
		TenderPage,
		TestPage,

		PageScrollDirective
	],
	imports: [
		CommonModule,
		I18nModule,
		FormsModule,
		DialogModule,
		CommonTooltipModule,
		DownloadSeriesModule,
		GraphModule,
		TableModule,
		PipesModule,
		SliderModule,
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
