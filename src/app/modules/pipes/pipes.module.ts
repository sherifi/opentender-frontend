import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NameGuardPipe} from './name-guard.pipe';
import {EuropamLinkPipe} from './europam-url.pipe';
import {FormatNumberPipe} from './format-number.pipe';
import {FormatFileSizePipe} from './format-filesize.pipe';
import {FormatDatetimePipe} from './format-datetime.pipe';
import {FormatDatePipe} from './format-date.pipe';
import {FormatCurrencyPipe, FormatCurrencyValuePipe} from './format-currency.pipe';
import {PortalLinkPipe} from './portal-url.pipe';
import {FormatIndicatorNamePipe} from './format-indicator.pipe';
import {ExpandUnderlinedPipe} from './expand-underlined.pipe';
import {EncodeURIComponentPipe} from './encode-uri.pipe';
import {FOISearchLinkPipe} from './foi-search-url.pipe';
import {DefinedPipe} from './defined.pipe';
import {ExpandCountryPipe} from './expand-country.pipe';
import {ExtractDomainPipe} from './extract-domain.pipe';

@NgModule({
	imports: [
		CommonModule,
		RouterModule
	],
	declarations: [
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
		FOISearchLinkPipe,
		FormatNumberPipe,
		PortalLinkPipe
	],
	exports: [
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
		FOISearchLinkPipe,
		FormatNumberPipe,
		PortalLinkPipe
	]
})
export class PipesModule {
}
