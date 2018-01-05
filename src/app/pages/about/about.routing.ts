import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AboutOpentenderPage} from './opentender/opentender.component';
import {AboutDataQualityPage} from './quality/quality.component';
import {AboutHowPage} from './how/how.component';
import {AboutGlossaryPage} from './glossary/glossary.component';
import {AboutPage} from './about.component';

const routes: Routes = [
	{ path: '', component: AboutPage,
		children: [
			{path: '', redirectTo: 'about-opentender', pathMatch: 'full'},
			{path: 'about-opentender', component: AboutOpentenderPage},
			{path: 'how-opentender-works', component: AboutHowPage},
			{path: 'glossary', component: AboutGlossaryPage},
			{path: 'quality', component: AboutDataQualityPage}
		]
	}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
