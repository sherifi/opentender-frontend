import {Utils} from './utils';

export enum FilterType {
	text = 1,
	select = 2,
	value = 3,
	range = 4,
	term = 5,
	none = 0
}

export interface Bucket {
	name?: string;
	key: string;
	doc_count: number;
}

export interface FilterDef {
	id: string;
	name: string;
	field: string;
	type: FilterType;
	group?: string;
	size?: number;
	aggregation_field?: string; // if empty "field" is used for aggregation, too
	aggregation_type?: FilterType; // if empty "type" is used for aggregation, too
	valueFormatter?: (string) => string;
	valuesFilter?: (buckets: Array<Bucket>) => Array<Bucket>;
}

export const TenderFilterDefs: Array<FilterDef> = [
	{
		id: 'buyers.name',
		name: 'Name',
		group: 'Buyer',
		field: 'buyers.name',
		type: FilterType.text,
		aggregation_field: 'buyers.name.raw',
		aggregation_type: FilterType.term
	},
	{
		id: 'buyers.address.city',
		name: 'City',
		group: 'Buyer',
		field: 'buyers.address.city',
		type: FilterType.text,
		valueFormatter: Utils.capitalize
	},
	{
		id: 'buyers.address.country',
		name: 'Country',
		group: 'Buyer',
		field: 'buyers.address.country',
		type: FilterType.select,
		valueFormatter: Utils.expandCountry,
		size: 30
	},
	{
		id: 'buyers.mainActivities',
		name: 'Main Activities',
		group: 'Buyer',
		field: 'buyers.mainActivities',
		type: FilterType.select,
		valueFormatter: Utils.expandUnderlined,
		size: 30
	},
	{
		id: 'buyers.buyerType',
		name: 'Type',
		group: 'Buyer',
		field: 'buyers.buyerType',
		type: FilterType.select,
		valueFormatter: Utils.expandUnderlined
	},

	{
		id: 'lots.bids.bidders.name',
		name: 'Name',
		group: 'Supplier',
		field: 'lots.bids.bidders.name',
		type: FilterType.text,
		aggregation_field: 'lots.bids.bidders.name.raw',
		aggregation_type: FilterType.term
	},
	{
		id: 'lots.bids.bidders.address.city',
		name: 'City',
		group: 'Supplier',
		field: 'lots.bids.bidders.address.city',
		type: FilterType.text,
		valueFormatter: Utils.capitalize
	},
	{
		id: 'lots.bids.bidders.address.country',
		name: 'Country',
		group: 'Supplier',
		field: 'lots.bids.bidders.address.country',
		type: FilterType.select,
		valueFormatter: Utils.expandCountry,
		size: 30
	},

	{
		id: 'title',
		name: 'Title',
		group: 'Tender',
		field: 'title',
		type: FilterType.text,
		aggregation_field: 'title.stopped',
		aggregation_type: FilterType.term,
		valueFormatter: Utils.capitalize
	},
	{
		id: 'titleEnglish',
		name: 'Title English',
		group: 'Tender',
		field: 'titleEnglish',
		type: FilterType.text,
		valueFormatter: Utils.capitalize
	},
	{
		id: 'country',
		name: 'Country',
		group: 'Tender',
		field: 'country',
		type: FilterType.select,
		valueFormatter: Utils.expandCountry,
		size: 30
	},

	{
		id: 'procedureType',
		name: 'Procedure Type',
		group: 'Tender',
		field: 'procedureType',
		type: FilterType.select,
		valueFormatter: Utils.expandUnderlined,
		size: 30
	},
	{
		id: 'supplyType',
		name: 'Supply Type',
		group: 'Tender',
		field: 'supplyType',
		type: FilterType.select,
		valueFormatter: Utils.expandUnderlined
	},

	{
		id: 'cpvs.code.divisions',
		name: 'CPV (Divisions)',
		group: 'Sector',
		field: 'cpvs.code.divisions',
		type: FilterType.select
	},
	{
		id: 'cpvs.code.groups',
		name: 'CPV (Groups)',
		group: 'Sector',
		field: 'cpvs.code.groups',
		type: FilterType.select
	},
	{
		id: 'cpvs.code.categories',
		name: 'CPV (Categories)',
		group: 'Sector',
		field: 'cpvs.code.categories',
		type: FilterType.select
	},
	{
		id: 'cpvs.code',
		name: 'CPV (Full)',
		group: 'Sector',
		field: 'cpvs.code',
		type: FilterType.select
	},

	{
		id: 'indicators.type',
		name: 'All',
		group: 'Indicators',
		field: 'indicators.type',
		type: FilterType.select,
		valueFormatter: Utils.formatIndicatorName
	},
	{
		id: 'indicators.type_cri',
		name: 'Corruption Risk',
		group: 'Indicators',
		field: 'indicators.type',
		type: FilterType.select,
		size: 30, // TODO: make request and do not filter in client
		valueFormatter: Utils.formatIndicatorName,
		valuesFilter: (buckets) => {
			return buckets.filter(bucket => {
				return bucket.key.indexOf('CORRUPTION_') === 0;
			});
		}
	},
	{
		id: 'indicators.type_aci',
		name: 'Administrative Capacity',
		group: 'Indicators',
		field: 'indicators.type',
		type: FilterType.select,
		size: 30, // TODO: make request and do not filter in client
		valueFormatter: Utils.formatIndicatorName,
		valuesFilter: (buckets) => {
			return buckets.filter(bucket => {
				return bucket.key.indexOf('ADMINISTRATIVE_') === 0;
			});
		}
	},
	{
		id: 'indicators.type_ti',
		name: 'Transparency',
		group: 'Indicators',
		field: 'indicators.type',
		type: FilterType.select,
		size: 30, // TODO: make request and do not filter in client
		valueFormatter: Utils.formatIndicatorName,
		valuesFilter: (buckets) => {
			return buckets.filter(bucket => {
				return bucket.key.indexOf('TRANSPARENCY_') === 0;
			});
		}
	},

	{
		id: 'finalPrice.netAmount',
		name: 'Final Price',
		group: 'Prices',
		field: 'finalPrice.netAmount',
		type: FilterType.value
	},
	{
		id: 'documentsPrice.netAmount',
		name: 'Document Price',
		group: 'Prices',
		field: 'documentsPrice.netAmount',
		type: FilterType.value
	},
	{
		id: 'estimatedPrice.netAmount',
		name: 'Estimated Price',
		group: 'Prices',
		field: 'estimatedPrice.netAmount',
		type: FilterType.value
	},
	{
		id: 'lots.bids.price.netAmount',
		name: 'Bid Price',
		group: 'Prices',
		field: 'lots.bids.price.netAmount',
		type: FilterType.value
	},
	{
		id: 'lots.awardDecisionDate',
		name: 'Award Decision Year',
		group: 'Dates',
		field: 'lots.awardDecisionDate',
		type: FilterType.range,
	}
];

export const CompanyFilterDefs: Array<FilterDef> = [
	{
		id: 'body.name',
		name: 'Name',
		field: 'body.name',
		group: 'Company',
		type: FilterType.text,
		aggregation_field: 'body.name.raw',
		aggregation_type: FilterType.term
	},
	{
		id: 'body.address.city',
		name: 'City',
		group: 'Company',
		field: 'body.address.city',
		type: FilterType.text,
		valueFormatter: Utils.capitalize
	},
	{
		id: 'body.address.country',
		name: 'Country',
		group: 'Company',
		field: 'body.address.country',
		type: FilterType.select,
		valueFormatter: Utils.expandCountry,
		size: 30
	}];

export const AuthorityFilterDefs: Array<FilterDef> = [
	{
		id: 'body.name',
		name: 'Name',
		group: 'Authority',
		field: 'body.name',
		type: FilterType.text,
		aggregation_field: 'body.name.raw',
		aggregation_type: FilterType.term
	},
	{
		id: 'body.address.city',
		name: 'City',
		group: 'Authority',
		field: 'body.address.city',
		type: FilterType.text,
		valueFormatter: Utils.capitalize
	},
	{
		id: 'body.address.country',
		name: 'Country',
		group: 'Authority',
		field: 'body.address.country',
		valueFormatter: Utils.expandCountry,
		type: FilterType.select,
		size: 30
	},
	{
		id: 'body.mainActivities',
		name: 'Main Activities',
		group: 'Authority',
		field: 'body.mainActivities',
		type: FilterType.select,
		valueFormatter: Utils.expandUnderlined,
		size: 30
	}
];
