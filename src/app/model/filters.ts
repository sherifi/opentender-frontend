import {Utils} from './utils';
import {Consts} from './consts';
import {ISearchFilterDef, ISearchFilterDefType} from '../app.interfaces';

export const TenderFilterDefs: Array<ISearchFilterDef> = [
	{
		id: 'buyers.name',
		name: 'Name',
		group: 'Buyer',
		field: 'buyers.name',
		type: ISearchFilterDefType.text,
		aggregation_field: 'buyers.name.raw',
		aggregation_type: ISearchFilterDefType.term
	},
	{
		id: 'buyers.address.city',
		name: 'City',
		group: 'Buyer',
		field: 'buyers.address.city',
		type: ISearchFilterDefType.text,
		valueFormatter: Utils.capitalize
	},
	{
		id: 'buyers.address.country',
		name: 'Country',
		group: 'Buyer',
		field: 'buyers.address.country',
		type: ISearchFilterDefType.select,
		valueFormatter: Utils.expandCountry,
		size: 30
	},
	{
		id: 'buyers.mainActivities',
		name: 'Main Activities',
		group: 'Buyer',
		field: 'buyers.mainActivities',
		type: ISearchFilterDefType.select,
		valueFormatter: Utils.expandUnderlined,
		size: 30
	},
	{
		id: 'buyers.buyerType',
		name: 'Type',
		group: 'Buyer',
		field: 'buyers.buyerType',
		type: ISearchFilterDefType.select,
		valueFormatter: Utils.expandUnderlined
	},

	{
		id: 'lots.bids.bidders.name',
		name: 'Name',
		group: 'Supplier',
		field: 'lots.bids.bidders.name',
		type: ISearchFilterDefType.text,
		aggregation_field: 'lots.bids.bidders.name.raw',
		aggregation_type: ISearchFilterDefType.term
	},
	{
		id: 'lots.bids.bidders.address.city',
		name: 'City',
		group: 'Supplier',
		field: 'lots.bids.bidders.address.city',
		type: ISearchFilterDefType.text,
		valueFormatter: Utils.capitalize
	},
	{
		id: 'lots.bids.bidders.address.country',
		name: 'Country',
		group: 'Supplier',
		field: 'lots.bids.bidders.address.country',
		type: ISearchFilterDefType.select,
		valueFormatter: Utils.expandCountry,
		size: 30
	},

	{
		id: 'title',
		name: 'Title',
		group: 'Tender',
		field: 'title',
		type: ISearchFilterDefType.text,
		aggregation_field: 'title.stopped',
		aggregation_type: ISearchFilterDefType.term,
		valueFormatter: Utils.capitalize
	},
	{
		id: 'titleEnglish',
		name: 'Title English',
		group: 'Tender',
		field: 'titleEnglish',
		type: ISearchFilterDefType.text,
		valueFormatter: Utils.capitalize
	},
	{
		id: 'country',
		name: 'Country',
		group: 'Tender',
		field: 'country',
		type: ISearchFilterDefType.select,
		valueFormatter: Utils.expandCountry,
		size: 30
	},

	{
		id: 'procedureType',
		name: 'Procedure Type',
		group: 'Tender',
		field: 'procedureType',
		type: ISearchFilterDefType.select,
		valueFormatter: Utils.expandUnderlined,
		size: 30
	},
	{
		id: 'supplyType',
		name: 'Supply Type',
		group: 'Tender',
		field: 'supplyType',
		type: ISearchFilterDefType.select,
		valueFormatter: Utils.expandUnderlined
	},

	{
		id: 'cpvs.code.divisions',
		name: 'CPV (Divisions)',
		group: 'Sector',
		field: 'cpvs.code.divisions',
		type: ISearchFilterDefType.select
	},
	{
		id: 'cpvs.code.groups',
		name: 'CPV (Groups)',
		group: 'Sector',
		field: 'cpvs.code.groups',
		type: ISearchFilterDefType.select
	},
	{
		id: 'cpvs.code.categories',
		name: 'CPV (Categories)',
		group: 'Sector',
		field: 'cpvs.code.categories',
		type: ISearchFilterDefType.select
	},
	{
		id: 'cpvs.code',
		name: 'CPV (Full)',
		group: 'Sector',
		field: 'cpvs.code',
		type: ISearchFilterDefType.select
	},
	{
		id: 'indicators.score_co',
		name: 'Composite Score',
		group: 'Score',
		field: 'scores.value',
		subrequest: {
			'scores.type': 'TENDER'
		},
		type: ISearchFilterDefType.range,
	},
	{
		id: 'indicators.score_pi',
		name: 'Procurement Integrity',
		group: 'Score',
		field: 'scores.value',
		subrequest: {
			'scores.type': Consts.indicators.CORRUPTION.id
		},
		type: ISearchFilterDefType.range,
	},
	{
		id: 'indicators.score_ac',
		name: 'Administrative Capacity',
		group: 'Score',
		field: 'scores.value',
		subrequest: {
			'scores.type': Consts.indicators.ADMINISTRATIVE.id
		},
		type: ISearchFilterDefType.range,
	},
	{
		id: 'indicators.score_ti',
		name: 'Transparency Score',
		group: 'Score',
		field: 'scores.value',
		subrequest: {
			'scores.type': Consts.indicators.TRANSPARENCY.id
		},
		type: ISearchFilterDefType.range,
	},
	{
		id: 'finalPrice.netAmountEur',
		name: 'Final Price EUR',
		group: 'Prices',
		field: 'finalPrice.netAmountEur',
		type: ISearchFilterDefType.value
	},
	{
		id: 'documentsPrice.netAmountEur',
		name: 'Document Price EUR',
		group: 'Prices',
		field: 'documentsPrice.netAmountEur',
		type: ISearchFilterDefType.value
	},
	{
		id: 'estimatedPrice.netAmountEur',
		name: 'Estimated Price EUR',
		group: 'Prices',
		field: 'estimatedPrice.netAmountEur',
		type: ISearchFilterDefType.value
	},
	{
		id: 'lots.bids.price.netAmountEur',
		name: 'Bid Price EUR',
		group: 'Prices',
		field: 'lots.bids.price.netAmountEur',
		type: ISearchFilterDefType.value
	},
	{
		id: 'lots.awardDecisionDate.year',
		name: 'Award Decision Year',
		group: 'Dates',
		field: 'lots.awardDecisionDate',
		type: ISearchFilterDefType.years,
	},
	{
		id: 'lots.awardDecisionDate',
		name: 'Award Decision Date',
		group: 'Dates',
		field: 'lots.awardDecisionDate',
		type: ISearchFilterDefType.date,
	},
	{
		id: 'estimatedCompletionDate.year',
		name: 'Estimated Completion Year',
		group: 'Dates',
		field: 'estimatedCompletionDate',
		type: ISearchFilterDefType.years,
	},
	{
		id: 'estimatedCompletionDate',
		name: 'Estimated Completion Date',
		group: 'Dates',
		field: 'estimatedCompletionDate',
		type: ISearchFilterDefType.date,
	},
	{
		id: 'estimatedStartDate.year',
		name: 'Estimated Start Year',
		group: 'Dates',
		field: 'estimatedStartDate',
		type: ISearchFilterDefType.years,
	},
	{
		id: 'estimatedStartDate',
		name: 'Estimated Start Date',
		group: 'Dates',
		field: 'estimatedStartDate',
		type: ISearchFilterDefType.date,
	}
];

export const CompanyFilterDefs: Array<ISearchFilterDef> = [
	{
		id: 'body.name',
		name: 'Name',
		field: 'body.name',
		group: 'Company',
		type: ISearchFilterDefType.text,
		aggregation_field: 'body.name.raw',
		aggregation_type: ISearchFilterDefType.term
	},
	{
		id: 'body.address.city',
		name: 'City',
		group: 'Company',
		field: 'body.address.city',
		type: ISearchFilterDefType.text,
		valueFormatter: Utils.capitalize
	},
	{
		id: 'body.address.country',
		name: 'Country',
		group: 'Company',
		field: 'body.address.country',
		type: ISearchFilterDefType.select,
		valueFormatter: Utils.expandCountry,
		size: 30
	}];

export const AuthorityFilterDefs: Array<ISearchFilterDef> = [
	{
		id: 'body.name',
		name: 'Name',
		group: 'Authority',
		field: 'body.name',
		type: ISearchFilterDefType.text,
		aggregation_field: 'body.name.raw',
		aggregation_type: ISearchFilterDefType.term
	},
	{
		id: 'body.address.city',
		name: 'City',
		group: 'Authority',
		field: 'body.address.city',
		type: ISearchFilterDefType.text,
		valueFormatter: Utils.capitalize
	},
	{
		id: 'body.address.country',
		name: 'Country',
		group: 'Authority',
		field: 'body.address.country',
		valueFormatter: Utils.expandCountry,
		type: ISearchFilterDefType.select,
		size: 30
	},
	{
		id: 'body.mainActivities',
		name: 'Main Activities',
		group: 'Authority',
		field: 'body.mainActivities',
		type: ISearchFilterDefType.select,
		valueFormatter: Utils.expandUnderlined,
		size: 30
	},
	{
		id: 'body.buyerType',
		name: 'Buyer Type',
		group: 'Authority',
		field: 'body.buyerType',
		type: ISearchFilterDefType.select,
		valueFormatter: Utils.expandUnderlined,
		size: 30
	}
];
