import {Utils} from './utils';


export interface Bucket {
	key: string;
	doc_count: number;
}

export interface FilterDef {
	id: string;
	name: string;
	field: string;
	type: string;
	group?: string;
	size?: number;
	aggregation_field?: string; // if empty "field" is used for aggregation, too
	aggregation_type?: string; // if empty "type" is used for aggregation, too
	valueFormatter?: (string) => string;
	valuesFilter?: (buckets: Array<Bucket>) => Array<Bucket>;
}

export const TenderFilterDefs: Array<FilterDef> = [
	{
		id: 'buyers.name',
		name: 'Authority Name',
		group: 'Authority',
		field: 'buyers.name',
		type: 'text',
		aggregation_field: 'buyers.name.raw',
		aggregation_type: 'term'
	},
	{
		id: 'buyers.address.city',
		name: 'Authority City',
		group: 'Authority',
		field: 'buyers.address.city',
		type: 'text',
		valueFormatter: Utils.capitalize
	},
	{
		id: 'buyers.address.country',
		name: 'Authority Country',
		group: 'Authority',
		field: 'buyers.address.country',
		type: 'select',
		valueFormatter: Utils.expandCountry,
		size: 30
	},
	{
		id: 'lots.bids.bidders.address.country',
		name: 'Company Country',
		group: 'Company',
		field: 'lots.bids.bidders.address.country',
		type: 'select',
		valueFormatter: Utils.expandCountry,
		size: 30
	},
	{
		id: 'country',
		name: 'Tender Country',
		group: 'Tender',
		field: 'country',
		type: 'select',
		valueFormatter: Utils.expandCountry,
		size: 30
	},
	{
		id: 'buyers.mainActivities',
		name: 'Authority Main Activities',
		group: 'Authority',
		field: 'buyers.mainActivities',
		type: 'select',
		valueFormatter: Utils.expandUnderlined,
		size: 30
	},
	{
		id: 'lots.bids.bidders.name',
		name: 'Company Name',
		group: 'Company',
		field: 'lots.bids.bidders.name',
		type: 'text',
		aggregation_field: 'lots.bids.bidders.name.raw',
		aggregation_type: 'term'
	},
	{
		id: 'lots.bids.bidders.address.city',
		name: 'Company City',
		group: 'Company',
		field: 'lots.bids.bidders.address.city',
		type: 'text',
		valueFormatter: Utils.capitalize
	},
	{
		id: 'title',
		name: 'Tender Title',
		group: 'Tender',
		field: 'title',
		type: 'text',
		aggregation_field: 'title.stopped',
		aggregation_type: 'term',
		valueFormatter: Utils.capitalize
	},
	{
		id: 'titleEnglish',
		name: 'Tender Title English',
		group: 'Tender',
		field: 'titleEnglish',
		type: 'text',
		valueFormatter: Utils.capitalize
	},
	{
		id: 'cpvs.code',
		name: 'CPV',
		group: 'Tender',
		field: 'cpvs.code',
		type: 'select'
	},
	{
		id: 'buyers.buyerType',
		name: 'Authority Type',
		group: 'Authority',
		field: 'buyers.buyerType',
		type: 'select',
		valueFormatter: Utils.expandUnderlined
	},
	{
		id: 'procedureType',
		name: 'Procedure Type',
		group: 'Tender',
		field: 'procedureType',
		type: 'select',
		valueFormatter: Utils.expandUnderlined,
		size: 30
	},
	{
		id: 'supplyType',
		name: 'Supply Type',
		group: 'Tender',
		field: 'supplyType',
		type: 'select',
		valueFormatter: Utils.expandUnderlined
	},
	{
		id: 'indicators.type',
		name: 'Indicators',
		group: 'Tender Indicators',
		field: 'indicators.type',
		type: 'select',
		valueFormatter: Utils.expandUnderlined
	},
	{
		id: 'indicators.type_cri',
		name: 'Corruption Risk Indicators',
		group: 'Tender Indicators',
		field: 'indicators.type',
		type: 'select',
		valueFormatter: Utils.formatIndicatorName,
		valuesFilter: (buckets) => {
			return buckets.filter(bucket => {
				return bucket.key.indexOf('CORRUPTION_') === 0;
			});
		}
	},
	{
		id: 'indicators.type_aqi',
		name: 'Administrative Quality Indicators',
		group: 'Tender Indicators',
		field: 'indicators.type',
		type: 'select',
		valueFormatter: Utils.formatIndicatorName,
		valuesFilter: (buckets) => {
			return buckets.filter(bucket => {
				return bucket.key.indexOf('ADMINISTRATIVE_') === 0;
			});
		}
	},
	{
		id: 'indicators.type_ti',
		name: 'Transparency Indicators',
		group: 'Tender Indicators',
		field: 'indicators.type',
		type: 'select',
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
		group: 'Tender Prices',
		field: 'finalPrice.netAmount',
		type: 'value'
	},
	{
		id: 'documentsPrice.netAmount',
		name: 'Document Price',
		group: 'Tender Prices',
		field: 'documentsPrice.netAmount',
		type: 'value'
	},
	{
		id: 'estimatedPrice.netAmount',
		name: 'Estimated Price',
		group: 'Tender Prices',
		field: 'estimatedPrice.netAmount',
		type: 'value'
	},
	{
		id: 'lots.bids.price.netAmount',
		name: 'Lot Bid Price',
		group: 'Tender Prices',
		field: 'lots.bids.price.netAmount',
		type: 'value'
	},
	{
		id: 'lots.awardDecisionDate',
		name: 'Award Decision Year',
		group: 'Tender Dates',
		field: 'lots.awardDecisionDate',
		type: 'range',
	}
];

export const CompanyFilterDefs: Array<FilterDef> = [
	{
		id: 'body.name',
		name: 'Name',
		field: 'body.name',
		group: 'Company',
		type: 'text',
		aggregation_field: 'body.name.raw',
		aggregation_type: 'term'
	},
	{
		id: 'body.address.city',
		name: 'City',
		group: 'Company',
		field: 'body.address.city',
		type: 'text',
		valueFormatter: Utils.capitalize
	},
	{
		id: 'body.address.country',
		name: 'Country',
		group: 'Company',
		field: 'body.address.country',
		type: 'select',
		valueFormatter: Utils.expandCountry,
		size: 30
	}];

export const AuthorityFilterDefs: Array<FilterDef> = [
	{
		id: 'body.name',
		name: 'Name',
		group: 'Authority',
		field: 'body.name',
		type: 'text',
		aggregation_field: 'body.name.raw',
		aggregation_type: 'term'
	},
	{
		id: 'body.address.city',
		name: 'City',
		group: 'Authority',
		field: 'body.address.city',
		type: 'text',
		valueFormatter: Utils.capitalize
	},
	{
		id: 'body.address.country',
		name: 'Country',
		group: 'Authority',
		field: 'body.address.country',
		valueFormatter: Utils.expandCountry,
		type: 'select',
		size: 30
	},
	{
		id: 'body.mainActivities',
		name: 'Main Activities',
		group: 'Authority',
		field: 'body.mainActivities',
		type: 'select',
		valueFormatter: Utils.expandUnderlined,
		size: 30
	}
];
