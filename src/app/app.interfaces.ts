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

export interface IStatsLotsInYears {
	[year: string]: {
		total: number;
		value: number;
		percent: number;
	};
}

export interface IStatsCpvs {
	[id: string]: { name: string; value: number; percent: number; total: number };
}

export interface IStatsIndicators {
	[name: string]: number;
}

export interface IStats {
	cpvs: IStatsCpvs;
	lots_in_years: {
		[year: string]: number;
	};
	indicators: IStatsIndicators;
	lots_pc_in_years: IStatsLotsInYears;
	bids_in_years: {
		[year: string]: number;
	};
	sum_price: {
		[currency: string]: number;
	};
	suppliers: {
		top10: Array<ICompany>
	};
	buyers: {
		top10: Array<IAuthority>
	};
	corruption: {
		[_type: string]: number;
	},
	counts: {
		bids_awarded: number;
		bids: number;
		lots: number;
		tenders: number;
	};
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

export interface IVizData {
	tender_lots_per_year?: {
		lots_in_years: {
			[year: string]: number;
		};
	};
	sectors_count?: Array<ISector>;
	sectors_volume?: Array<any>;
	sectors_stats?: Array<{ sector: ISector; stats: IStats }>;
	corruption_indicators?: IStats;
}
