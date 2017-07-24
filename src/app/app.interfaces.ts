import Buyer = Definitions.Buyer;
import Bidder = Definitions.Bidder;
import Tender = Definitions.Tender;
import {ColumnSort} from './model/columns';

export interface ISector {
	id: string;
	name: string;
	value?: number;
}

export interface ICountryStats {
	[country: string]: number;
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

export interface IStatsPcLotsInYears {
	[year: string]: {
		total: number;
		value: number;
		percent: number;
	};
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

export interface IStatsSumPrices {
	[currency: string]: number;
}
export interface IStatsAuthorities {
	top10: Array<IAuthority>;
}
export interface IStatsCompanies {
	top10: Array<ICompany>;
}

export interface IStats {
	terms_main_cpvs: IStatsCpvs;
	terms_pc_main_cpvs: IStatsPcCpvs;
	terms_main_cpvs_full: IStatsPcCpvs;
	sums_finalPrice: IStatsSumPrices;
	top_winning_companies: IStatsCompanies;
	top_companies: IStatsCompanies;
	top_authorities: IStatsAuthorities;
	count_lots_bids: IStatsCounts;
	terms_indicators: IStatsIndicators;
	histogram_lots_awardDecisionDate: IStatsLotsInYears;
	histogram_pc_lots_awardDecisionDate: IStatsPcLotsInYears;
	sectors_stats: Array<{ sector: ISector; stats: IStats }>;
}

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
