/// <reference path="./model/tender.d.ts" />
import Buyer = Definitions.Buyer;
import Bidder = Definitions.Bidder;
import Tender = Definitions.Tender;
import {ColumnSort} from './model/columns';
import {Country} from './services/config.service';
import {IChartData} from './thirdparty/ngx-charts-universal/chart.interface';

export interface IndicatorInfo {
	id: string;
	name: string;
	plural: string;
	icon: string;
	subindicators: {
		[id: string]: {
			name: string;
			desc: string;
		}
	};
}

export interface SubIndicator {
	id: string;
	sid: string;
	name: string;
	desc: string;
}

export interface Indicator {
	id: string;
	sid: string;
	name: string;
	plural: string;
	icon: string;
	subindicators: SubIndicator[];
}


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

export interface IAuthoritySources {
	body: Buyer;
	tender: string;
	country: string;
}

export interface IAuthority {
	body: Buyer;
	sources?: IAuthoritySources[];
	value?: number;
}

export interface ICompanySources {
	body: Buyer;
	tender: string;
	country: string;
}

export interface ICompany {
	body: Bidder;
	sources: ICompanySources[];
	value?: number;
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

export interface IStatsPriceEUR {
	value: number;
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
		sum_finalPriceEUR: IStatsPriceEUR;
		avg_finalPriceEUR: IStatsPriceEUR;
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
	sum_finalPriceEUR: IStatsPriceEUR;
	avg_finalPriceEUR: IStatsPriceEUR;
	top_sum_finalPrice_authorities: IStatsAuthorities;
	top_terms_companies: IStatsCompanies;
	top_sum_finalPrice_companies: IStatsCompanies;
	top_terms_authorities: IStatsAuthorities;
	count_lots_bids: IStatsCounts;
	terms_indicators: IStatsIndicators;
	terms_indicators_score: IStatsIndicators;
	histogram_lots_awardDecisionDate: IStatsLotsInYears;
	histogram_pc_lots_awardDecisionDate: IStatsPcLotsInYears;
	histogram_pc_lots_awardDecisionDate_finalPrices: IStatsPcPricesLotsInYears;
	sectors_stats: Array<{ sector: ISector; stats: IStats }>;
	region_stats: Array<{ id: string; value: number, stats: IStats }>;
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

export interface IDownloadTenderApiResult {
	data: {
		id: string;
	};
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

export interface ISeries {
	data: Array<IChartData>;
	header: { value: string, name: string };
	filename: string;
}

export interface ISeriesProvider {
	getSeriesInfo: () => ISeries;
}
