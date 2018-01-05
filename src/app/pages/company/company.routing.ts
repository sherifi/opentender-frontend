import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CompanyPage} from './company.component';

const routes: Routes = [
	{path: ':id', component: CompanyPage}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
