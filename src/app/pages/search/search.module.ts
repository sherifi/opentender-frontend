import {NgModule} from '@angular/core';
import {routing} from './search.routing';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SearchPage} from './search.component';
import {SearchTenderPage} from './tender/tender.component';
import {SearchCompanyPage} from './company/company.component';
import {SearchAuthorityPage} from './authority/authority.component';
import {SearchBoxComponent} from './components/searchbox/searchbox.component';
import {AutoCompleteComponent} from './components/searchbox/components/autocomplete/autocomplete.component';
import {SelectSearchesButtonComponent} from './components/searchbox/components/select-search-button/select-search-button.component';
import {ValueInputComponent} from './components/searchbox/components/value-input/value-input.component';
import {SelectDateFilterComponent} from './components/filterbox/components/date/select-date-filter-component';
import {SelectFiltersButtonComponent} from './components/filterbox/components/select-filters-button/select-filters-button.component';
import {SelectFiltersComponent} from './components/filterbox/components/select-filters/select-filters.component';
import {SelectScoreRangeFilterComponent} from './components/filterbox/components/score-range/select-score-range-filter.component';
import {SelectYearRangeFilterComponent} from './components/filterbox/components/year-range/select-year-range-filter.component';
import {FilterBoxComponent} from './components/filterbox/filterbox.component';
import {MyDatePickerModule} from 'mydatepicker';
import {TableModule} from '../../modules/tables/table.module';
import {DialogModule} from '../../modules/dialog/dialog.module';
import {I18nModule} from '../../modules/i18n/i18n.module';
import {PipesModule} from '../../modules/pipes/pipes.module';
import {SliderModule} from '../../modules/slider/silder.module';
import {TypeaheadModule} from '../../thirdparty/typeahead/typeahead.module';
import {SearchSectorPage} from './sector/sector.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		routing,
		MyDatePickerModule,
		I18nModule,
		TableModule,
		PipesModule,
		TypeaheadModule,
		SliderModule,
		DialogModule
	],
	declarations: [
		SearchPage,
		SearchTenderPage,
		SearchCompanyPage,
		SearchAuthorityPage,
		FilterBoxComponent,
		SelectFiltersButtonComponent,
		SelectFiltersComponent,
		SelectYearRangeFilterComponent,
		SelectScoreRangeFilterComponent,
		SelectDateFilterComponent,
		SearchBoxComponent,
		SearchSectorPage,
		AutoCompleteComponent,
		SelectSearchesButtonComponent,
		ValueInputComponent
	]
})
export class SearchModule {
}
