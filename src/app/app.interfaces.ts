/// <reference path="./model/tender.d.ts" />
import Buyer = Definitions.Buyer;
import Bidder = Definitions.Bidder;
import Tender = Definitions.Tender;
import {ColumnSort} from './model/columns';
import {Country} from './services/config.service';

export interface ISector {
	id: string;
	name: string;
	level: string;
	value?: number;
}

export interface IRegion {
	id: string;
	name: string;
	level: number;
	value?: number;
}

export interface ICountryStats {
	id: string;
	name: string;
	value: number;
}

export interface IUsageEntry {
	field: string;
	available: number;
	missing: number;
}

export interface IAuthority {
	body: Buyer;
	value?: number;
	country?: string;
}

export interface ICompany {
	body: Bidder;
	value?: number;
	country?: string;
}

export interface IStatsLotsInYears {
	[year: string]: number;
}

export interface IStatsPcCpvs {
	[id: string]: { name: string; value: number; percent: number; total: number };
}

export interface IStatsCpvs {
	[id: string]: { name: string; value: number };
}

export interface IStatsCounts {
	bids_awarded: number;
	bids: number;
	lots: number;
	tenders: number;
}

export interface IStatsIndicators {
	[name: string]: number;
}

export interface IStatsNuts {
	[nutscode: string]: number;
}

export interface IStatsPrices {
	[currency: string]: number;
}

export interface IStatsPcLotsInYears {
	[year: string]: {
		total: number;
		value: number;
		percent: number;
	};
}

export interface IStatsPcPricesLotsInYears {
	[year: string]: {
		total: number;
		value: number;
		percent: number;
		sums_finalPrice: IStatsPrices;
		avgs_finalPrice: IStatsPrices;
	};
}

export interface IStatsAuthorities {
	top10: Array<IAuthority>;
}

export interface IStatsCompanies {
	top10: Array<ICompany>;
}

export interface IStats {
	terms_authority_nuts: IStatsNuts;
	terms_company_nuts: IStatsNuts;
	terms_main_cpv_categories: IStatsCpvs;
	terms_main_cpv_groups: IStatsCpvs;
	terms_main_cpv_divisions: IStatsCpvs;
	terms_main_cpv_full: IStatsCpvs;
	terms_pc_main_cpv_divisions: IStatsPcCpvs;
	sums_finalPrice: IStatsPrices;
	top_winning_companies: IStatsCompanies;
	top_companies: IStatsCompanies;
	top_authorities: IStatsAuthorities;
	count_lots_bids: IStatsCounts;
	terms_indicators: IStatsIndicators;
	histogram_lots_awardDecisionDate: IStatsLotsInYears;
	histogram_pc_lots_awardDecisionDate: IStatsPcLotsInYears;
	histogram_pc_lots_awardDecisionDate_finalPrices: IStatsPcPricesLotsInYears;
	sectors_stats: Array<{ sector: ISector; stats: IStats }>;
}

export interface ISectorStats {
	sector: ISector;
	parents?: Array<ISector>;
	stats: IStats;
}

export interface IRegionStats {
	region: IRegion;
	parents?: Array<IRegion>;
	stats: IStats;
}

/* search-result-packages */

export interface ISearchTenderData {
	hits: {
		total: number;
		hits: Array<Tender>;
	};
	sortBy: ColumnSort;
	aggregations: any;
}

export interface ISearchAuthorityData {
	hits: {
		total: number;
		hits: Array<IAuthority>;
	};
	aggregations: any;
}

export interface ISearchCompanyData {
	hits: {
		total: number;
		hits: Array<ICompany>;
	};
	aggregations: any;
}

/* api-transfer-packages */

export interface ITenderApiResult {
	data: Tender;
}

export interface ISectorsApiResult {
	data: {
		[cpvcode: string]: { name: string; value: number; level: string }
	};
}

export interface IPortalsApiResult {
	data: Array<Country>;
}

export interface IPortalsStatsApiResult {
	data: Array<ICountryStats>;
}

export interface IUsageApiResult {
	data: Array<IUsageEntry>;
}

export interface ICompanyApiResult {
	data: {
		company: ICompany;
	};
}

export interface ICompanySimilarApiResult {
	data: {
		similar: Array<ICompany>;
	};
}

export interface IAuthorityApiResult {
	data: {
		authority: IAuthority;
	};
}

export interface INutsApiResult {
	data: IStatsNuts;
}

export interface IAuthoritySimilarApiResult {
	data: {
		similar: Array<IAuthority>;
	};
}

export interface ISectorApiResult {
	data: ISectorStats;
}

export interface IRegionApiResult {
	data: IRegionStats;
}

export interface ISchemaApiResult {
	data: any;
}

export interface ISearchCompanyApiResult {
	data: ISearchCompanyData;
}

export interface ISearchAuthorityApiResult {
	data: ISearchAuthorityData;
}

export interface ISearchTenderApiResult {
	data: ISearchTenderData;
}

export interface IStatApiResult {
	data: IStats;
}

export interface IStatStatsApiResult {
	data: {
		stats: IStats;
	};
}

export interface IApiResult {
	data: any;
}

export interface IApiGeoJSONResult {
	type: string;
	features: Array<{
		properties: {
			id: string;
			name: string;
		}
	}>;
}
