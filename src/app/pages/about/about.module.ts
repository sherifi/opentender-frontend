import {NgModule} from '@angular/core';
import {routing} from './about.routing';
import {CommonModule} from '@angular/common';
import {AboutOpentenderPage} from './opentender/opentender.component';
import {AboutPage} from './about.component';
import {AboutHowPage} from './how/how.component';
import {AboutGlossaryPage} from './glossary/glossary.component';
import {FormsModule} from '@angular/forms';
import {BreadcrumbModule} from '../../modules/breadcrumb/breadcrumb.module';
import {AboutPartnerNetworkPage} from './partner-network/partner-network.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		BreadcrumbModule,
		routing
	],
	declarations: [
		AboutPage,
		AboutOpentenderPage,
		AboutGlossaryPage,
		AboutPartnerNetworkPage,
		AboutHowPage
	]
})
export class AboutModule {
}
