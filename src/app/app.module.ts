import {NgModule, ModuleWithProviders} from '@angular/core';

import {NgxChartsModule} from './thirdparty/ngx-charts-universal/ngx-charts.module';
import {DropdownModule} from './thirdparty/dropdown/dropdown.module';
import {FormsModule} from '@angular/forms';
import {TypeaheadModule} from './thirdparty/typeahead/typeahead.module';
import {SliderModule} from './components/slider/silder.module';

import {routing, appRoutingProviders}  from './app.routes';
import {App} from './app.component';

import {DefinedPipe} from './directives/defined.pipe';
import {ExpandCountryPipe} from './directives/expand-country.pipe';
import {ExpandUnderlinedPipe} from './directives/expand-underlined.pipe';
import {ExtractDomainPipe} from './directives/extract-domain.pipe';
import {FormatCurrencyValuePipe, FormatCurrencyPipe} from './directives/format-currency';
import {FormatDatePipe} from './directives/format-date.pipe';
import {FormatDatetimePipe} from './directives/format-datetime.pipe';
import {FormatFileSizePipe} from './directives/format-filesize.pipe';
import {KeyValuesPipe} from './directives/key-values.pipe';
import {TruncatePipe} from './directives/truncate.pipe';

import {AboutPage} from './pages/documentation/about/about.component';
import {AuthorityPage} from './pages/authority/authority.component';
import {CompanyPage} from './pages/company/company.component';
import {DocumentationFOIPage} from './pages/documentation/foi/foi.component';
import {DocumentationHowPage} from './pages/documentation/how/how.component';
import {DocumentationMethodologyPage} from './pages/documentation/methodology/methodology.component';
import {DocumentationPage} from './pages/documentation/documentation.component';
import {DocumentationQualityPage} from './pages/documentation/quality/quality.component';
import {DownloadsPage} from './pages/downloads/downloads.component';
import {ExploreAdministrativeQualityPage} from './pages/explore/quality/quality.component';
import {ExploreCorruptionPage} from './pages/explore/corruption/corruption.component';
import {ExploreLatestPage} from './pages/explore/latest/latest.component';
import {ExplorePage} from './pages/explore/explore.component';
import {ExploreRankingsPage} from './pages/explore/rankings/rankings.component';
import {ExploreSectorsPage} from './pages/explore/sectors/sectors.component';
import {ExploreTransparencyPage} from './pages/explore/transparency/transparency.component';
import {HomePage} from './pages/home/home.component';
import {ImprintPage} from './pages/imprint/imprint.component';
import {SearchAuthorityPage} from './pages/search/authority/authority.component';
import {SearchCompanyPage} from './pages/search/company/company.component';
import {SearchPage} from './pages/search/search.component';
import {SearchSectorPage} from './pages/search/sector/sector.component';
import {SearchTenderPage} from './pages/search/tender/tender.component';
import {SectorPage} from './pages/sector/sector.component';
import {StartPage} from './pages/start/start.component';
import {TenderPage} from './pages/tender/tender.component';

import {AuthorityTableComponent} from './components/tables/table.authority.component';
import {AutoCompleteComponent} from './components/inputs/autocomplete.component';
import {CompanyTableComponent} from './components/tables/table.company.component';
import {DialogComponent} from './components/dialog.component';
import {FilterBoxComponent} from './components/filterbox.component';
import {FooterComponent} from './components/footer.component';
import {HeaderComponent} from './components/header.component';
import {PageScrollDirective} from './directives/page-scroll.directive';
import {PaginationComponent} from './components/tables/pagination.component';
import {PortalMapComponent, SVGCountryGroupDirective} from './components/map-portal.component';
import {SearchBoxComponent} from './components/searchbox.component';
import {SelectColumnsButtonComponent} from './components/selects/select-columns-button.component';
import {SelectColumnsComponent} from './components/selects/select-columns.component';
import {SelectFiltersButtonComponent} from './components/selects/select-filters-button.component';
import {SelectFiltersComponent} from './components/selects/select-filters.component';
import {SelectRangeFilterComponent} from './components/selects/select-range-filter.component';
import {StartMapComponent} from './pages/start/start-map.component';
import {TableComponent} from './components/tables/table.component';
import {TenderBodyComponent, TenderPriceComponent, TenderBodyAddressComponent, TenderBodyLineComponent, CollapseExpandComponent} from './components/tender.components';
import {TenderTableComponent} from './components/tables/table.tender.component';
import {TreeViewComponent, DocumentationDataformatPage} from './pages/documentation/data/dataformat.component';
import {ValueInputComponent} from './components/inputs/valueinput.component';

import {ApiService} from './services/api.service';
import {ConfigService} from './services/config.service';
import {CountryService} from './services/country.service';
import {PortalsService} from './services/portals.service';
import {StateService} from './services/state.service';
import {TitleService} from './services/title.service';

import * as Portals from 'portals.json';
import {SelectSearchesButtonComponent} from './components/selects/select-search-button.component';
import {Title} from '@angular/platform-browser';
import {PlatformService} from './services/platform.service';
import {NameGuardPipe} from './directives/name-guard.pipe';
import {EncodeURIComponentPipe} from './directives/encode-uri.pipe';
import {CommonTooltipModule} from './thirdparty/ngx-charts-universal/common/tooltip/common-tooltip.module';
import {EuropamLinkPipe} from './directives/europam-url.pipe';

@NgModule({
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
		PortalMapComponent,
		SearchBoxComponent,
		SelectColumnsButtonComponent,
		SelectColumnsComponent,
		SelectSearchesButtonComponent,
		SelectFiltersButtonComponent,
		SelectFiltersComponent,
		SelectRangeFilterComponent,
		StartMapComponent,
		TableComponent,
		TenderBodyAddressComponent,
		TenderBodyComponent,
		TenderBodyLineComponent,
		TenderPriceComponent,
		TenderTableComponent,
		TreeViewComponent,
		ValueInputComponent,

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
		KeyValuesPipe,
		TruncatePipe,

		AboutPage,
		AuthorityPage,
		CompanyPage,
		DocumentationDataformatPage,
		DocumentationFOIPage,
		DocumentationHowPage,
		DocumentationMethodologyPage,
		DocumentationPage,
		DocumentationQualityPage,
		DownloadsPage,
		ExploreAdministrativeQualityPage,
		ExploreCorruptionPage,
		ExploreLatestPage,
		ExplorePage,
		ExploreRankingsPage,
		ExploreSectorsPage,
		ExploreTransparencyPage,
		HomePage,
		ImprintPage,
		SearchAuthorityPage,
		SearchCompanyPage,
		SearchPage,
		SearchSectorPage,
		SearchTenderPage,
		SectorPage,
		StartPage,
		TenderPage,

		PageScrollDirective,
		SVGCountryGroupDirective
	],
	imports: [
		routing,
		FormsModule,
		DropdownModule,
		NgxChartsModule,
		CommonTooltipModule,
		SliderModule,
		TypeaheadModule
	],
	providers: []
})
export class AppModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AppModule,
			providers: [
				{provide: 'portals', useValue: Portals},
				appRoutingProviders,
				TitleService,
				PortalsService,
				CountryService,
				ConfigService,
				StateService,
				PlatformService,
				Title,
				ApiService
			]
		};
	}
}

export {App};
