import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SectorPage} from './sector.component';

const routes: Routes = [
	{path: ':id', component: SectorPage}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
