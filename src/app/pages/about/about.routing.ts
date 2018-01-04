import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AboutOpentenderPage} from './opentender/opentender.component';
import {AboutDataQualityPage} from './quality/quality.component';
import {AboutFOIPage} from './foi/foi.component';
import {AboutHowPage} from './how/how.component';
import {AboutGlossaryPage} from './glossary/glossary.component';
import {AboutPage} from './about.component';

const routes: Routes = [
	{ path: '', component: AboutPage,
		children: [
			{path: '', redirectTo: 'about-opentender', pathMatch: 'full'},
			{path: 'about-opentender', component: AboutOpentenderPage, data: {title: 'About Opentender', menu: true}},
			{path: 'how-opentender-works', component: AboutHowPage, data: {title: 'How Opentender works', menu: true}},
			{path: 'glossary', component: AboutGlossaryPage, data: {title: 'Glossary', menu: true}},
			{path: 'foi', component: AboutFOIPage, data: {title: 'FOI Overview'}},
			{path: 'quality', component: AboutDataQualityPage, data: {title: 'Data Quality'}}
		]
	}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
