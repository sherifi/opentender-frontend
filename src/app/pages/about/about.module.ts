import {NgModule} from '@angular/core';
import {routing} from './about.routing';
import {CommonModule} from '@angular/common';
import {AboutOpentenderPage} from './opentender/opentender.component';
import {AboutPage} from './about.component';
import {AboutDataQualityPage} from './quality/quality.component';
import {AboutFOIPage} from './foi/foi.component';
import {AboutHowPage} from './how/how.component';
import {AboutGlossaryPage} from './glossary/glossary.component';
import {FormsModule} from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		routing
	],
	declarations: [
		AboutPage,
		AboutOpentenderPage,
		AboutGlossaryPage,
		AboutFOIPage,
		AboutHowPage,
		AboutDataQualityPage,

	]
})
export class AboutModule {
}
