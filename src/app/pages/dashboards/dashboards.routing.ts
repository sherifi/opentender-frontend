import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardsIntegrityPage} from './procurement-integrity/procurement-integrity.component';
import {DashboardsTransparencyPage} from './transparency/transparency.component';
import {DashboardsAdministrativeCapacityPage} from './administrative-capacity/administrative-capacity.component';
import {DashboardsMarketAnalysisPage} from './market-analysis/market-analysis.component';
import {DashboardsPage} from './dashboards.component';

const routes: Routes = [
	{
		path: '',
		component: DashboardsPage,
		children: [
			{path: '', redirectTo: 'administrative-capacity', pathMatch: 'full'},
			{path: 'market-analysis', component: DashboardsMarketAnalysisPage},
			{path: 'administrative-capacity', component: DashboardsAdministrativeCapacityPage},
			{path: 'transparency', component: DashboardsTransparencyPage},
			{path: 'integrity', component: DashboardsIntegrityPage}
		]
	}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
