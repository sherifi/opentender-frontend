import {Utils} from './utils';

export interface FilterDef {
	name: string;
	field: string;
	type: string;
	group?: string;
	size?: number;
	aggregation_field?: string; // if empty "field" is used for aggregation, too
	aggregation_type?: string; // if empty "type" is used for aggregation, too
	valueFormatter?: (string) => string;
}

export const TenderFilterDefs: Array<FilterDef> = [
	{
		name: 'Authority Name',
		group: 'Authority',
		field: 'buyers.name',
		type: 'text',
		aggregation_field: 'buyers.name.raw',
		aggregation_type: 'term'
	},
	{
		name: 'Authority City',
		group: 'Authority',
		field: 'buyers.address.city',
		type: 'text',
		valueFormatter: Utils.capitalize
	},
	{
		name: 'Authority Country',
		group: 'Authority',
		field: 'buyers.address.country',
		type: 'select',
		valueFormatter: Utils.expandCountry,
		size: 30
	},
	{
		name: 'Company Country',
		group: 'Company',
		field: 'lots.bids.bidders.address.country',
		type: 'select',
		valueFormatter: Utils.expandCountry,
		size: 30
	},
	{
		name: 'Tender Country',
		group: 'Tender',
		field: 'country',
		type: 'select',
		valueFormatter: Utils.expandCountry,
		size: 30
	},
	{
		name: 'Authority Main Activities',
		group: 'Authority',
		field: 'buyers.mainActivities',
		type: 'select',
		valueFormatter: Utils.expandUnderlined,
		size: 30
	},
	{
		name: 'Company Name',
		group: 'Company',
		field: 'lots.bids.bidders.name',
		type: 'text',
		aggregation_field: 'lots.bids.bidders.name.raw',
		aggregation_type: 'term'
	},
	{
		name: 'Company City',
		group: 'Company',
		field: 'lots.bids.bidders.address.city',
		type: 'text',
		valueFormatter: Utils.capitalize
	},
	{
		name: 'Title',
		group: 'Tender',
		field: 'title',
		type: 'text',
		aggregation_field: 'title.stopped',
		aggregation_type: 'term',
		valueFormatter: Utils.capitalize
	},
	{
		name: 'Title English',
		group: 'Tender',
		field: 'titleEnglish',
		type: 'text',
		valueFormatter: Utils.capitalize
	},
	{
		name: 'CPV',
		group: 'Tender',
		field: 'cpvs.code',
		type: 'select'
	},
	{
		name: 'Authority Type',
		group: 'Authority',
		field: 'buyers.buyerType',
		type: 'select',
		valueFormatter: Utils.expandUnderlined
	},
	{
		name: 'Procedure Type',
		group: 'Tender',
		field: 'procedureType',
		type: 'select',
		valueFormatter: Utils.expandUnderlined,
		size: 30
	},
	{
		name: 'Supply Type',
		group: 'Tender',
		field: 'supplyType',
		type: 'select',
		valueFormatter: Utils.expandUnderlined
	},
	{
		name: 'Indicators',
		group: 'Tender',
		field: 'indicators.type',
		type: 'select',
		valueFormatter: Utils.expandUnderlined
	},
	{
		name: 'Final Price',
		group: 'Tender Prices',
		field: 'finalPrice.netAmount',
		type: 'value'
	},
	{
		name: 'Document Price',
		group: 'Tender Prices',
		field: 'documentsPrice.netAmount',
		type: 'value'
	},
	{
		name: 'Estimated Price',
		group: 'Tender Prices',
		field: 'estimatedPrice.netAmount',
		type: 'value'
	},
	{
		name: 'Lot Bid Price',
		group: 'Tender Prices',
		field: 'lots.bids.price.netAmount',
		type: 'value'
	},
	{
		name: 'Award Decision Year',
		group: 'Tender Dates',
		field: 'lots.awardDecisionDate',
		type: 'range',
	}
];

export const CompanyFilterDefs: Array<FilterDef> = [
	{
		name: 'Name',
		field: 'body.name',
		group: 'Company',
		type: 'text',
		aggregation_field: 'body.name.raw',
		aggregation_type: 'term'
	},
	{
		name: 'City',
		group: 'Company',
		field: 'body.address.city',
		type: 'text',
		valueFormatter: Utils.capitalize
	},
	{
		name: 'Country',
		group: 'Company',
		field: 'body.address.country',
		type: 'select',
		valueFormatter: Utils.expandCountry,
		size: 30
	}];

export const AuthorityFilterDefs: Array<FilterDef> = [
	{
		name: 'Name',
		group: 'Authority',
		field: 'body.name',
		type: 'text',
		aggregation_field: 'body.name.raw',
		aggregation_type: 'term'
	},
	{
		name: 'City',
		group: 'Authority',
		field: 'body.address.city',
		type: 'text',
		valueFormatter: Utils.capitalize
	},
	{
		name: 'Country',
		group: 'Authority',
		field: 'body.address.country',
		valueFormatter: Utils.expandCountry,
		type: 'select',
		size: 30
	},
	{
		name: 'Main Activities',
		group: 'Authority',
		field: 'body.mainActivities',
		type: 'select',
		valueFormatter: Utils.expandUnderlined,
		size: 30
	}
];
