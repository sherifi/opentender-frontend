import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthorityPage} from './authority.component';

const routes: Routes = [
	{path: ':id', component: AuthorityPage}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
