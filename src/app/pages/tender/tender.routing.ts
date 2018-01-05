import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TenderPage} from './tender.component';

const routes: Routes = [
	{path: ':id', component: TenderPage}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
