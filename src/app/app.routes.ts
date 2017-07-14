import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AboutOpentenderPage} from './pages/about/opentender/opentender.component';
import {AuthorityPage} from './pages/authority/authority.component';
import {CompanyPage} from './pages/company/company.component';
import {AboutDataformatPage} from './pages/about/data/dataformat.component';
import {AboutFOIPage} from './pages/about/foi/foi.component';
import {AboutHowPage} from './pages/about/how/how.component';
import {AboutPage} from './pages/about/about.component';
import {AboutDataQualityPage} from './pages/about/quality/quality.component';
import {DownloadsPage} from './pages/downloads/downloads.component';
import {DashboardsAdministrativeQualityPage} from './pages/dashboards/administrative-quality/administrative-quality.component';
import {DashboardsCorruptionPage} from './pages/dashboards/corruption-risk/corruption-risk.component';
import {DashboardsLatestPage} from './pages/dashboards/latest/latest.component';
import {DashboardsPage} from './pages/dashboards/dashboards.component';
import {DashboardsRankingsPage} from './pages/dashboards/rankings/rankings.component';
import {DashboardsMarketAnalysisPage} from './pages/dashboards/market-analysis/market-analysis.component';
import {DashboardsTransparencyPage} from './pages/dashboards/transparency/transparency.component';
import {HomePage} from './pages/home/home.component';
import {ImprintPage} from './pages/imprint/imprint.component';
import {SearchAuthorityPage} from './pages/search/authority/authority.component';
import {SearchCompanyPage} from './pages/search/company/company.component';
import {SearchPage} from './pages/search/search.component';
import {SearchTenderPage} from './pages/search/tender/tender.component';
import {SectorPage} from './pages/sector/sector.component';
import {StartPage} from './pages/start/start.component';
import {TenderPage} from './pages/tender/tender.component';
import {TestPage} from './pages/test/test.component';

export const routes: Routes = [
	{path: '', component: HomePage},
	{path: 'start', component: StartPage},

	{
		path: 'dashboards',
		component: DashboardsPage,
		data: {title: 'Dashboards'},
		children: [
			{path: 'market-analysis', component: DashboardsMarketAnalysisPage, data: {title: 'Market Analysis'}},
			{path: 'latest', component: DashboardsLatestPage, data: {title: 'Latest Tenders'}},
			{path: 'rankings', component: DashboardsRankingsPage, data: {title: 'Rankings'}},
			{path: 'transparency-indicators', component: DashboardsTransparencyPage, data: {title: 'Transparency Indicators'}},
			{path: 'corruption-indicators', component: DashboardsCorruptionPage, data: {title: 'Explore Corruption Risk Indicators'}},
			{path: 'administrative-quality', component: DashboardsAdministrativeQualityPage, data: {title: 'Administrative Quality Indicators'}}
		]
	},
	{
		path: 'search',
		component: SearchPage,
		data: {title: 'Search'},
		children: [
			{path: '', redirectTo: 'tender', pathMatch: 'full'},
			{path: 'tender', component: SearchTenderPage, data: {title: 'Search Tender'}},
			{path: 'company', component: SearchCompanyPage, data: {title: 'Search Company'}},
			{path: 'authority', component: SearchAuthorityPage, data: {title: 'Search Authority'}}
		]
	},

	{path: 'company/:id', component: CompanyPage},
	{path: 'authority/:id', component: AuthorityPage},
	{path: 'tender/:id', component: TenderPage},
	{path: 'sector/:id', component: SectorPage},

	{
		path: 'about',
		component: AboutPage,
		data: {title: 'About'},
		children: [
			{path: 'about-opentender', component: AboutOpentenderPage, data: {title: 'About Opentender'}},
			{path: 'how-opentender-works', component: AboutHowPage, data: {title: 'How Opentender works'}},
			{path: 'dataformat', component: AboutDataformatPage, data: {title: 'Raw Data Format'}},
			{path: 'foi', component: AboutFOIPage, data: {title: 'FOI Overview'}},
			{path: 'quality', component: AboutDataQualityPage, data: {title: 'Data Quality'}}
		]
	},
	{path: 'downloads', component: DownloadsPage, data: {title: 'Downloads'}},
	{path: 'imprint', component: ImprintPage, data: {title: 'Imprint'}},

	{path: 'test', component: TestPage, data: {title: 'Test'}},
	{path: '**', redirectTo: 'start'}
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
