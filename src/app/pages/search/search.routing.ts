import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SearchPage} from './search.component';
import {SearchTenderPage} from './tender/tender.component';
import {SearchAuthorityPage} from './authority/authority.component';
import {SearchCompanyPage} from './company/company.component';

const routes: Routes = [
	{
		path: '',
		component: SearchPage,
		children: [
			{path: '', redirectTo: 'tender', pathMatch: 'full'},
			{path: 'tender', component: SearchTenderPage},
			{path: 'company', component: SearchCompanyPage},
			{path: 'authority', component: SearchAuthorityPage}
		]
	}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
