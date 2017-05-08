import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AboutPage} from './pages/about/about.component';
import {AuthorityPage} from './pages/authority/authority.component';
import {CompanyPage} from './pages/company/company.component';
import {DocumentationDataformatPage} from './pages/documentation/data/dataformat.component';
import {DocumentationFOIPage} from './pages/documentation/foi/foi.component';
import {DocumentationHowPage} from './pages/documentation/how/how.component';
import {DocumentationMethodologyPage} from './pages/documentation/methodology/methodology.component';
import {DocumentationPage} from './pages/documentation/documentation.component';
import {DocumentationQualityPage} from './pages/documentation/quality/quality.component';
import {DownloadsPage} from './pages/downloads/downloads.component';
import {ExploreAdministrativeQualityPage} from './pages/explore/quality/quality.component';
import {ExploreCorruptionPage} from './pages/explore/corruption/corruption.component';
import {ExploreLatestPage} from './pages/explore/latest/latest.component';
import {ExplorePage} from './pages/explore/explore.component';
import {ExploreRankingsPage} from './pages/explore/rankings/rankings.component';
import {ExploreSectorsPage} from './pages/explore/sectors/sectors.component';
import {ExploreTransparencyPage} from './pages/explore/transparency/transparency.component';
import {HomePage} from './pages/home/home.component';
import {ImprintPage} from './pages/imprint/imprint.component';
import {SearchAuthorityPage} from './pages/search/authority/authority.component';
import {SearchCompanyPage} from './pages/search/company/company.component';
import {SearchPage} from './pages/search/search.component';
import {SearchSectorPage} from './pages/search/sector/sector.component';
import {SearchTenderPage} from './pages/search/tender/tender.component';
import {SectorPage} from './pages/sector/sector.component';
import {StartPage} from './pages/start/start.component';
import {TenderPage} from './pages/tender/tender.component';


export const routes: Routes = [
	{path: '', component: HomePage},
	{path: 'start', component: StartPage},
	{
		path: 'explore',
		component: ExplorePage,
		data: {title: 'Explore Data'},
		children: [
			{path: 'latest', component: ExploreLatestPage, data: {title: 'Explore Latest Tenders'}},
			{path: 'rankings', component: ExploreRankingsPage, data: {title: 'Explore Rankings'}},
			{path: 'transparency-indicators', component: ExploreTransparencyPage, data: {title: 'Explore Transparency Indicators'}},
			{path: 'corruption-indicators', component: ExploreCorruptionPage, data: {title: 'Explore Corruption Risk Indicators'}},
			{path: 'administrative-quality', component: ExploreAdministrativeQualityPage, data: {title: 'Explore Administrative Quality'}},
			{path: 'sectors', component: ExploreSectorsPage, data: {title: 'Explore Sectors'}}
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
			{path: 'authority', component: SearchAuthorityPage, data: {title: 'Search Authority'}},
			{path: 'sector', component: SearchSectorPage, data: {title: 'Search Sector'}}
		]
	},

	{path: 'company/:id', component: CompanyPage},
	{path: 'authority/:id', component: AuthorityPage},
	{path: 'tender/:id', component: TenderPage},
	{path: 'sector/:id', component: SectorPage},

	{
		path: 'documentation',
		component: DocumentationPage,
		data: {title: 'Documentation'},
		children: [
			{path: 'how-opentender-works', component: DocumentationHowPage, data: {title: 'How Opentender works'}},
			{path: 'methodology', component: DocumentationMethodologyPage, data: {title: 'Methodology'}},
			{path: 'dataformat', component: DocumentationDataformatPage, data: {title: 'Raw Data Format'}},
			{path: 'foi', component: DocumentationFOIPage, data: {title: 'FOI Overview'}},
			{path: 'quality', component: DocumentationQualityPage, data: {title: 'Data Quality'}}
		]
	},

	{path: 'downloads', component: DownloadsPage, data: {title: 'Downloads'}},
	{path: 'imprint', component: ImprintPage, data: {title: 'Imprint'}},
	{path: 'about', component: AboutPage, data: {title: 'About'}},
	{path: '**', redirectTo: 'start'}
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
