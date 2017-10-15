import {FormsModule} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {NgxChartsModule} from './thirdparty/ngx-charts-universal/ngx-charts.module';
import {DropdownModule} from './thirdparty/dropdown/dropdown.module';
import {TypeaheadModule} from './thirdparty/typeahead/typeahead.module';
import {SliderModule} from './components/slider/silder.module';
import {CommonTooltipModule} from './thirdparty/ngx-charts-universal/common/tooltip/common-tooltip.module';
import {AppRoutingModule} from './app.routes';
import {ToastyModule} from 'ng2-toasty';

import {App} from './app.component';

import {DefinedPipe} from './directives/defined.pipe';
import {EncodeURIComponentPipe} from './directives/encode-uri.pipe';
import {EuropamLinkPipe} from './directives/europam-url.pipe';
import {ExpandCountryPipe} from './directives/expand-country.pipe';
import {ExpandUnderlinedPipe} from './directives/expand-underlined.pipe';
import {ExtractDomainPipe} from './directives/extract-domain.pipe';
import {FOISearchLinkPipe} from './directives/foi-search-url.pipe';
import {FormatCurrencyValuePipe, FormatCurrencyPipe} from './directives/format-currency';
import {FormatDatePipe} from './directives/format-date.pipe';
import {FormatDatetimePipe} from './directives/format-datetime.pipe';
import {FormatFileSizePipe} from './directives/format-filesize.pipe';
import {FormatNumberPipe} from './directives/format-number';
import {KeyValuesPipe} from './directives/key-values.pipe';
import {NameGuardPipe} from './directives/name-guard.pipe';
import {TruncatePipe} from './directives/truncate.pipe';
import {I18nPipe} from './directives/i18n.pipe';
import {FormatIndicatorNamePipe} from './directives/format-indicator.pipe';

import {AuthorityPage} from './pages/authority/authority.component';
import {CompanyPage} from './pages/company/company.component';
import {AboutPage} from './pages/about/about.component';
import {AboutOpentenderPage} from './pages/about/opentender/opentender.component';
import {AboutFOIPage} from './pages/about/foi/foi.component';
import {AboutHowPage} from './pages/about/how/how.component';
import {AboutDataQualityPage} from './pages/about/quality/quality.component';
import {DownloadPage} from './pages/download/download.component';
import {DashboardsAdministrativeCapacityPage} from './pages/dashboards/administrative-capacity/administrative-capacity.component';
import {DashboardsIntegrityPage} from './pages/dashboards/procurement-integrity/procurement-integrity.component';
import {DashboardsPage} from './pages/dashboards/dashboards.component';
import {DashboardsMarketAnalysisPage} from './pages/dashboards/market-analysis/market-analysis.component';
import {DashboardsTransparencyPage} from './pages/dashboards/transparency/transparency.component';
import {HomePage} from './pages/home/home.component';
import {ImprintPage} from './pages/imprint/imprint.component';
import {RegionPage} from './pages/region/region.component';
import {SearchAuthorityPage} from './pages/search/authority/authority.component';
import {SearchCompanyPage} from './pages/search/company/company.component';
import {SearchPage} from './pages/search/search.component';
import {SearchSectorPage} from './pages/search/sector/sector.component';
import {SearchTenderPage} from './pages/search/tender/tender.component';
import {SectorPage} from './pages/sector/sector.component';
import {StartPage} from './pages/start/start.component';
import {TenderPage} from './pages/tender/tender.component';
import {TestPage} from './pages/test/test.component';

import {AuthorityTableComponent} from './components/tables/table.authority.component';
import {AutoCompleteComponent} from './components/inputs/autocomplete.component';
import {CompanyTableComponent} from './components/tables/table.company.component';
import {DashboardsIndicatorComponent} from './pages/dashboards/indicator-dashboard.component';
import {DialogComponent} from './components/dialog.component';
import {FilterBoxComponent} from './components/inputs/filterbox.component';
import {FooterComponent} from './components/footer.component';
import {GraphAuthoritiesComponent} from './components/graphs/authorities.component';
import {GraphCompaniesComponent} from './components/graphs/companies.component';
import {GraphCountsComponent} from './components/graphs/counts.component';
import {GraphHistogramComponent} from './components/graphs/histogram.component';
import {GraphHomeHistogramComponent} from './components/graphs/home-histogram.component';
import {GraphIndicatorHistogramComponent} from './components/graphs/indicator-histogram.component';
import {GraphIndicatorSectorsComponent} from './components/graphs/indicator-sectors.component';
import {GraphIndicatorStructureComponent} from './components/graphs/indicator-structure.component';
import {GraphNutsMapComponent} from './components/maps/nuts-map.component';
import {GraphSupplierNutsMapComponent} from './components/maps/nuts-map-supplier.component';
import {GraphBuyerNutsMapComponent} from './components/maps/nuts-map-buyer.component';
import {GraphSectorsComponent} from './components/graphs/sectors.component';
import {GraphSectorTreemap} from './components/graphs/sector-treemap.component';
import {GraphSumPricesComponent} from './components/graphs/sums_price.component';
import {HeaderComponent} from './components/header.component';
import {HomeMapComponent} from './components/maps/nuts-map-home.component';
import {PageScrollDirective} from './directives/page-scroll.directive';
import {PaginationComponent} from './components/tables/pagination.component';
import {PortalMapComponent, SVGCountryGroupDirective} from './components/maps/map-portal.component';
import {SearchBoxComponent} from './components/inputs/searchbox.component';
import {SelectColumnsButtonComponent} from './components/selects/select-columns-button.component';
import {SelectColumnsComponent} from './components/selects/select-columns.component';
import {SelectDownloadSeriesComponent} from './components/selects/select-download-series.component';
import {SelectFiltersButtonComponent} from './components/selects/select-filters-button.component';
import {SelectFiltersComponent} from './components/selects/select-filters.component';
import {SelectRangeFilterComponent} from './components/selects/select-range-filter.component';
import {SelectSearchesButtonComponent} from './components/selects/select-search-button.component';
import {TableComponent} from './components/tables/table.component';
import {TenderBodyComponent, TenderPriceComponent, TenderBodyAddressComponent, TenderBodyLineComponent, CollapseExpandComponent} from './components/tender.components';
import {TenderTableComponent} from './components/tables/table.tender.component';
import {AboutGlossaryPage} from './pages/about/glossary/glossary.component';
import {ValueInputComponent} from './components/inputs/valueinput.component';
import {I18NComponent} from './components/i18n.component';

import {ApiService} from './services/api.service';
import {ConfigService} from './services/config.service';
import {PlatformService} from './services/platform.service';
import {StateService} from './services/state.service';
import {TitleService} from './services/title.service';
import {I18NService} from './services/i18n.service';
import {NotifyService} from './services/notify.service';
import {SelectSimilarListComponent} from './components/selects/select-similar-list.component';
import {GraphVolumeNutsMapComponent} from './components/maps/nuts-map-volume.component';

const AppConfig = {
	declarations: [
		App,

		AuthorityTableComponent,
		AutoCompleteComponent,
		CollapseExpandComponent,
		CompanyTableComponent,
		DialogComponent,
		FilterBoxComponent,
		FooterComponent,
		HeaderComponent,
		PaginationComponent,
		HomeMapComponent,
		PortalMapComponent,
		SearchBoxComponent,
		SelectColumnsButtonComponent,
		SelectColumnsComponent,
		SelectDownloadSeriesComponent,
		SelectSearchesButtonComponent,
		SelectFiltersButtonComponent,
		SelectFiltersComponent,
		SelectRangeFilterComponent,
		SelectSimilarListComponent,
		TableComponent,
		TenderBodyAddressComponent,
		TenderBodyComponent,
		TenderBodyLineComponent,
		TenderPriceComponent,
		TenderTableComponent,
		ValueInputComponent,
		DashboardsIndicatorComponent,
		GraphIndicatorHistogramComponent,
		GraphIndicatorSectorsComponent,
		GraphIndicatorStructureComponent,
		GraphSectorsComponent,
		GraphCountsComponent,
		GraphHistogramComponent,
		GraphSumPricesComponent,
		GraphAuthoritiesComponent,
		GraphCompaniesComponent,
		GraphNutsMapComponent,
		GraphHomeHistogramComponent,
		GraphSupplierNutsMapComponent,
		GraphBuyerNutsMapComponent,
		GraphVolumeNutsMapComponent,
		GraphSectorTreemap,
		I18NComponent,

		DefinedPipe,
		EuropamLinkPipe,
		ExpandCountryPipe,
		ExpandUnderlinedPipe,
		ExtractDomainPipe,
		EncodeURIComponentPipe,
		NameGuardPipe,
		FormatCurrencyPipe,
		FormatCurrencyValuePipe,
		FormatDatePipe,
		FormatDatetimePipe,
		FormatFileSizePipe,
		FormatIndicatorNamePipe,
		KeyValuesPipe,
		TruncatePipe,
		FOISearchLinkPipe,
		FormatNumberPipe,
		I18nPipe,

		AuthorityPage,
		CompanyPage,
		AboutPage,
		AboutOpentenderPage,
		AboutGlossaryPage,
		AboutFOIPage,
		AboutHowPage,
		AboutDataQualityPage,
		DownloadPage,
		DashboardsAdministrativeCapacityPage,
		DashboardsIntegrityPage,
		DashboardsPage,
		DashboardsMarketAnalysisPage,
		DashboardsTransparencyPage,
		HomePage,
		ImprintPage,
		RegionPage,
		SearchAuthorityPage,
		SearchCompanyPage,
		SearchPage,
		SearchSectorPage,
		SearchTenderPage,
		SectorPage,
		StartPage,
		TenderPage,
		TestPage,

		PageScrollDirective,
		SVGCountryGroupDirective
	],
	imports: [
		FormsModule,
		DropdownModule,
		NgxChartsModule,
		CommonTooltipModule,
		SliderModule,
		TypeaheadModule,
		ToastyModule,
		AppRoutingModule
	],
	providers: [
		TitleService,
		ConfigService,
		StateService,
		PlatformService,
		I18NService,
		NotifyService,
		Title,
		ApiService
	]
};

export {App, AppConfig};
