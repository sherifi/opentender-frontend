/// <reference path="./model/tender.d.ts" />
import Bidder = Definitions.Bidder;
import Tender = Definitions.Tender;
import Buyer = Definitions.Buyer;
import {Country} from './services/config.service';
import {IChartData} from './thirdparty/ngx-charts-universal/chart.interface';

/* data objects from api */

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

/* stats objects from api */

export interface IStatsCountry {
	id: string;
	name: string;
	value: number;
}

export interface IStatsInYears {
	[year: string]: number;
}

export interface IStatsScoresInYears {
	[id: string]: IStatsInYears;
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

export interface IStatsProcedureType {
	[name: string]: number;
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

export interface IStatsSector {
	sector: ISector;
	parents?: Array<ISector>;
	stats: IStats;
}

export interface IStatsRegion {
	region: IRegion;
	parents?: Array<IRegion>;
	stats: IStats;
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
	terms_procedure_type: IStatsProcedureType;
	terms_indicators_score: IStatsIndicators;
	histogram_lots_awardDecisionDate_avg_scores: IStatsScoresInYears;
	histogram_lots_awardDecisionDate: IStatsInYears;
	histogram_pc_lots_awardDecisionDate: IStatsPcLotsInYears;
	histogram_pc_lots_awardDecisionDate_finalPrices: IStatsPcPricesLotsInYears;
	sectors_stats: Array<{ sector: ISector; stats: IStats }>;
	region_stats: Array<{ id: string; value: number, stats: IStats }>;
}

/* search-result-packages */

export interface ISearchResultBucket {
	name?: string;
	key: string;
	doc_count: number;
}

export interface ISearchResultAggregation {
	[name: string]: {
		doc_count?: number;
		buckets: Array<ISearchResultBucket>;
	};
}

export interface ISearchResultTender {
	hits: {
		total: number;
		hits: Array<Tender>;
	};
	sortBy: ITableColumnSort;
	aggregations: ISearchResultAggregation;
}

export interface ISearchResultAuthority {
	hits: {
		total: number;
		hits: Array<IAuthority>;
	};
	sortBy: ITableColumnSort;
	aggregations: ISearchResultAggregation;
}

export interface ISearchResultCompany {
	hits: {
		total: number;
		hits: Array<ICompany>;
	};
	sortBy: ITableColumnSort;
	aggregations: ISearchResultAggregation;
}

/* api-transfer-packages */

export interface IApiResultTender {
	data: Tender;
}

export interface IApiResultSectors {
	data: {
		[cpvcode: string]: { name: string; value: number; level: string }
	};
}

export interface IApiResultPortals {
	data: Array<Country>;
}

export interface IApiResultPortalsStats {
	data: Array<IStatsCountry>;
}

export interface IApiResultUsage {
	data: Array<IUsageEntry>;
}

export interface IApiResultCompany {
	data: {
		company: ICompany;
	};
}

export interface IApiResultCompanySimilar {
	data: {
		similar: Array<ICompany>;
	};
}

export interface IApiResultAuthority {
	data: {
		authority: IAuthority;
	};
}

export interface IApiResultNuts {
	data: IStatsNuts;
}

export interface IApiResultAuthoritySimilar {
	data: {
		similar: Array<IAuthority>;
	};
}

export interface IApiResultSector {
	data: IStatsSector;
}

export interface IApiResultRegion {
	data: IStatsRegion;
}

export interface IApiResultSearchCompany {
	data: ISearchResultCompany;
}

export interface IApiResultSearchAuthority {
	data: ISearchResultAuthority;
}

export interface IApiResultSearchTender {
	data: ISearchResultTender;
}

export interface IApiResultDownloadTenderSearch {
	data: {
		id: string;
	};
}

export interface IApiResultStat {
	data: IStats;
}

export interface IApiResultStatStats {
	data: {
		stats: IStats;
	};
}

export interface IApiResultAutoComplete {
	data: Array<{
		key: string;
		value: number;
	}>;
}

export interface IApiResultDownloads {
	data: Array<{
		country: string;
		count: number;
		formats: {
			json: { filename: string; size: number },
			ndjson: { filename: string; size: number }
		}
	}>;
}

export interface IApiResult {
	data: any;
}

export interface IApiResultGeoJSON {
	type: string;
	features: Array<{
		properties: {
			id: string;
			name: string;
		}
	}>;
}

/* graph & map data export */

export interface ISeries {
	data: Array<IChartData>;
	header: { value: string, name: string };
	filename: string;
}

export interface ISeriesProvider {
	getSeriesInfo: () => ISeries;
}

/* search object helper */

export enum ISearchFilterDefType {
	text = 1,
	select = 2,
	value = 3,
	range = 4,
	term = 5,
	date = 6,
	none = 0
}

export interface ISearchFilterDef {
	id: string;
	name: string;
	field: string;
	type: ISearchFilterDefType;
	group?: string;
	size?: number;
	aggregation_field?: string; // if empty "field" is used for aggregation, too
	aggregation_type?: ISearchFilterDefType; // if empty "type" is used for aggregation, too
	valueFormatter?: (string) => string;
	valuesFilter?: (buckets: Array<ISearchResultBucket>) => Array<ISearchResultBucket>;
}

export interface ISearchFilter {
	def: ISearchFilterDef;
	aggregation_id?: string; // auto build field->id (xyz.xzy -> xyz_xyz as made be elastic aggregation result)
	value?: string; // the actual user search value
	values?: Array<any>; // the actual user search values, eg. range [year_start,year_end]
	enabled?: {}; // the additional filter strings based on user choosen aggregation
	buckets?: Array<ISearchResultBucket>; // the result of aggregation
	active?: boolean;
	mode?: string;
	minmax?: null | [number, number];
}

/* search commands */

export interface ISearchCommandAggregation {
	field: string;
	size?: number;
	type: string;
	aggregations?: ISearchCommandAggregation[];
}

export interface ISearchCommandFilter {
	field: string;
	value: Array<string | boolean | number>;
	type: string;
	sort?: string;
	mode?: string;
	and?: ISearchCommandFilter[];
}

export interface ISearchCommand {
	filters: Array<ISearchCommandFilter>;
	aggregations?: Array<ISearchCommandAggregation>;
	size?: number;
	from?: number;
	sort?: {
		field: string;
		ascend: boolean;
	};
}

export interface IGetByIdCommand {
	ids: Array<string>;
	filters?: Array<ISearchCommandFilter>;
}

/* Indicator Info Helpers */

export interface IIndicatorInfo {
	id: string;
	name: string;
	plural: string;
	icon: string;
	subindicators: Array<ISubIndicatorInfo>;
}

export interface ISubIndicatorInfo {
	id: string;
	name: string;
	desc: string;
}

/* table model */

export interface ITableCell {
	align?: string;
	lines: Array<ITableCellLine>;
}

export interface ITableRow {
	cells: Array<ITableCell>;
}

export interface ITable {
	columns: Array<ITableColumn>;
	rows: Array<ITableRow>;
	sortBy: ITableColumnSort;
}

export interface ITableColumnSort {
	id: string;
	ascend: boolean;
}

export interface ITableColumn {
	name: string;
	id: string;
	group: string;
	sortBy?: ITableColumnSort;
}

export interface ITableCellLine {
	content?: string;
	link?: string;
	prefix?: string;
	hint?: string;
	icon?: string;
	styleClass?: string;
}

export interface ITableColumnAuthority extends ITableColumn {
	format: (authority: IAuthority) => Array<ITableCellLine>;
}

export interface ITableColumnCompany extends ITableColumn {
	format: (company: ICompany) => Array<ITableCellLine>;
}

export interface ITableColumnTender extends ITableColumn {
	format: (tender: Tender) => Array<ITableCellLine>;
}

