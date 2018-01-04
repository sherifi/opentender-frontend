import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AuthorityPage} from './pages/authority/authority.component';
import {CompanyPage} from './pages/company/company.component';
import {DownloadPage} from './pages/download/download.component';
import {DashboardsAdministrativeCapacityPage} from './pages/dashboards/administrative-capacity/administrative-capacity.component';
import {DashboardsIntegrityPage} from './pages/dashboards/procurement-integrity/procurement-integrity.component';
import {DashboardsPage} from './pages/dashboards/dashboards.component';
import {DashboardsMarketAnalysisPage} from './pages/dashboards/market-analysis/market-analysis.component';
import {DashboardsTransparencyPage} from './pages/dashboards/transparency/transparency.component';
import {HomePage} from './pages/home/home.component';
import {ImprintPage} from './pages/imprint/imprint.component';
import {SectorPage} from './pages/sector/sector.component';
import {StartPage} from './pages/start/start.component';
import {TenderPage} from './pages/tender/tender.component';
import {TestPage} from './pages/test/test.component';
import {RegionPage} from './pages/region/region.component';

export const routes: Routes = [
	{
		path: '', component: HomePage, data: {menu: true, menu_title: 'Home', rootMenu: true}
	},
	{path: 'start', component: StartPage, data: {title: 'Opentender Portals'}},
	{
		path: 'dashboards',
		component: DashboardsPage,
		data: {title: 'Dashboards', menu: true, routerLink: ['/dashboards/market-analysis']},
		children: [
			{path: '', redirectTo: 'administrative-capacity', pathMatch: 'full'},
			{path: 'market-analysis', component: DashboardsMarketAnalysisPage, data: {title: 'Market Analysis', menu: true}},
			{path: 'administrative-capacity', component: DashboardsAdministrativeCapacityPage, data: {title: 'Administrative Capacity Indicators', menu: true, menu_title: 'Administrative Capacity'}},
			{path: 'transparency', component: DashboardsTransparencyPage, data: {title: 'Transparency Indicators', menu: true, menu_title: 'Transparency'}},
			{path: 'procurement-integrity', component: DashboardsIntegrityPage, data: {title: 'Procurement Integrity Indicators', menu: true, menu_title: 'Procurement Integrity'}}
		]
	},
	{
		path: 'search',
		data: {
			title: 'Search', menu: true, routerLink: ['/search/tender'],
			submenu: [
				{path: 'tender', data: {title: 'Search Tender', menu: true, menu_title: 'Tender'}},
				{path: 'company', data: {title: 'Search Company', menu: true, menu_title: 'Company'}},
				{path: 'authority', data: {title: 'Search Authority', menu: true, menu_title: 'Authority'}}
			]
		},
		loadChildren: './pages/search/search.module#SearchModule'
	},

	{path: 'company/:id', component: CompanyPage, data: {title: 'Company'}},
	{path: 'authority/:id', component: AuthorityPage, data: {title: 'Authority'}},
	{path: 'tender/:id', component: TenderPage, data: {title: 'Tender'}},
	{path: 'sector/:id', component: SectorPage, data: {title: 'Sector'}},
	{path: 'region/:id', component: RegionPage, data: {title: 'Region'}},
	{path: 'download', component: DownloadPage, data: {title: 'Download', menu: true, rootMenu: true}},
	{
		path: 'about',
		data: {
			title: 'About', menu: true, routerLink: ['/about/about-opentender'],
			submenu: [
				{path: 'about-opentender', data: {title: 'About Opentender', menu: true}},
				{path: 'how-opentender-works', data: {title: 'How Opentender works', menu: true}},
				{path: 'glossary', data: {title: 'Glossary', menu: true}}
			]
		},
		loadChildren: './pages/about/about.module#AboutModule'
	},
	{path: 'imprint', component: ImprintPage, data: {title: 'Imprint', rootMenu: true}},

	{path: 'test', component: TestPage, data: {title: 'Test'}},
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
