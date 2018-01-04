import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {SearchPage} from './search.component';
import {SearchTenderPage} from './tender/tender.component';
import {SearchAuthorityPage} from './authority/authority.component';
import {SearchCompanyPage} from './company/company.component';

const routes: Routes = [
	{ path: '', component: SearchPage,
		children: [
			{path: '', redirectTo: 'tender', pathMatch: 'full'},
			{path: 'tender', component: SearchTenderPage, data: {title: 'Search Tender', menu: true, menu_title: 'Tender'}},
			{path: 'company', component: SearchCompanyPage, data: {title: 'Search Company', menu: true, menu_title: 'Company'}},
			{path: 'authority', component: SearchAuthorityPage, data: {title: 'Search Authority', menu: true, menu_title: 'Authority'}}
		]
	}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
