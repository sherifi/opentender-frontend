import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RegionPage} from './region.component';

const routes: Routes = [
	{path: ':id', component: RegionPage}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
