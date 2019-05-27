import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomePage} from './pages/home/home.component';
import {StartPage} from './pages/start/start.component';

export const routes: Routes = [
	{path: '', component: HomePage},
	{path: 'start', component: StartPage},
	{path: 'dashboards', loadChildren: './pages/dashboards/dashboards.module#DashboardsModule'},
	{path: 'search', loadChildren: './pages/search/search.module#SearchModule'},
	{path: 'company', loadChildren: './pages/company/company.module#CompanyModule'},
	{path: 'authority', loadChildren: './pages/authority/authority.module#AuthorityModule'},
	{path: 'tender', loadChildren: './pages/tender/tender.module#TenderModule'},
	{path: 'sector', loadChildren: './pages/sector/sector.module#SectorModule'},
	{path: 'region', loadChildren: './pages/region/region.module#RegionModule'},
	{path: 'download', loadChildren: './pages/download/download.module#DownloadModule'},
	{path: 'about', loadChildren: './pages/about/about.module#AboutModule'},
	{path: 'imprint', loadChildren: './pages/imprint/imprint.module#ImprintModule'},
	{path: 'donate', loadChildren: './pages/donate/donate.module#DonateModule' },
	{path: '**', redirectTo: 'start'}
];

@NgModule({
	declarations: [],
	imports: [RouterModule.forRoot(routes
		// , {enableTracing: true}
	)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
