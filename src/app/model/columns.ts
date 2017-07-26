import Tender = Definitions.Tender;
import Buyer = Definitions.Buyer;
import Body = Definitions.Body;
import Lot = Definitions.Lot;
import Bid = Definitions.Bid;
import {Utils} from './utils';
import {IAuthority, ICompany} from '../app.interfaces';

const ICON = {
	tender: 'icon-newspaper',
	authority: 'icon-library',
	company: 'icon-office'
};

export interface Column {
	name: string;
	id: string;
	group: string;
	sortBy?: ColumnSort;
	right?: boolean;
}

export interface TableLine {
	content: string;
	link?: string;
	prefix?: string;
	list?: boolean;
}

export interface TableCell {
	lines: Array<TableLine>;
}

export interface TableRow {
	cells: Array<TableCell>;
}

export interface Table {
	name: string;
	columns: Array<Column>;
	rows: Array<TableRow>;
	sortBy: ColumnSort;
}

export interface ColumnSort {
	id: string;
	ascend: boolean;
}

export interface AuthorityColumn extends Column {
	format: (authority: IAuthority) => Array<TableLine>;
}

export const AuthorityColumns: Array<AuthorityColumn> = [
	{
		name: 'Name',
		id: 'body.name',
		group: 'Authority',
		format: authority => [{content: authority.body.name || '[Name not available]'}]
	},
	{
		name: 'City',
		id: 'body.address.city',
		group: 'Authority',
		format: authority => [{content: authority.body.address.city}]
	},
	{
		name: 'Country',
		id: 'body.address.country',
		group: 'Authority',
		format: authority => [{content: Utils.expandCountry(authority.body.address.country)}]
	},
	{
		name: 'Bids Count',
		id: 'count',
		group: 'Authority',
		format: authority => [{content: (authority.value || '').toString()}]
	},
	{
		name: 'Profile Link',
		id: 'id',
		group: 'Authority',
		format: authority => [{icon: ICON.authority + ' icon-large', content: '', link: '/authority/' + authority.body.groupId}]
	}
];

export interface CompanyColumn extends Column {
	format: (company: ICompany) => Array<TableLine>;
}

export const CompanyColumns: Array<CompanyColumn> = [
	{
		name: 'Name',
		group: 'Company',
		id: 'body.name',
		format: company => [{content: company.body.name || '[Name not available]'}]
	},
	{
		name: 'City',
		group: 'Company',
		id: 'body.address.city',
		format: company => [{content: company.body.address.city}]
	},
	{
		name: 'Country',
		group: 'Company',
		id: 'body.address.country',
		format: company => [{content: Utils.expandCountry(company.body.address.country)}]
	},
	{
		name: 'Bids Count',
		id: 'count',
		group: 'Company',
		format: company => [{content: (company.value || '').toString()}]
	},
	{
		name: 'Profile Link',
		id: 'id',
		group: 'Company',
		format: company => [{icon: ICON.company + ' icon-large', content: '', link: '/company/' + company.body.groupId}]
	}
];

export interface TenderColumn extends Column {
	format: (tender: Tender) => Array<TableLine>;
}

const FormatUtils = {
	formatPrice: (price) => {
		if (!price) {
			return [];
		}
		let result = [];
		['netAmountEur'].forEach(key => {
			if (price.hasOwnProperty(key)) {
				result.push({prefix: '(' + key + ')', content: Utils.formatCurrency('EUR') + '\u00a0' + Utils.formatCurrencyValue(price[key])});
			}
		});
		['netAmountNational'].forEach(key => {
			if (price.hasOwnProperty(key)) {
				result.push({prefix: '(' + key + ')', content: Utils.formatCurrency(price.currencyNational) + '\u00a0' + Utils.formatCurrencyValue(price[key])});
			}
		});
		// ['netAmount', 'amountWithVat', 'minNetAmount', 'maxNetAmount', 'minAmountWithVat', 'maxAmountWithVat'].forEach(key => {
		// 	if (price.hasOwnProperty(key)) {
		// 		result.push({prefix: '(' + key + ')', content: Utils.formatCurrency(price.currency) + '\u00a0' + Utils.formatCurrencyValue(price[key])});
		// 	}
		// });
		return result;
	}
};

export const TenderColumns: Array<TenderColumn> = [
	{
		name: 'Supplier',
		id: 'lots.bids.bidders.name',
		group: 'Company',
		// sortBy: {
		// 	id: 'lots.bids.bidders.name.raw',
		// 	ascend: true
		// },
		format: tender => {
			if (!tender.lots) {
				return [];
			}
			let companies = {}; // TODO: use bidder.stable_id if available someday
			tender.lots.forEach((lot: Lot, index_l: number) => {
				if (lot.bids) {
					lot.bids.forEach((bid: Bid) => {
						if (bid.bidders) {
							bid.bidders.forEach((bidder: Body) => {
								companies[bidder.name] = companies[bidder.name] || {bidder: bidder, lots: [], link: '/company/' + bidder.groupId};
								companies[bidder.name].lots.push(index_l + 1);
							});
						}
					});
				}
			});
			let result = [];
			Object.keys(companies).forEach(key => {
					let c = companies[key];
					if (tender.lots.length > 1) {
						if (c.lots.length > 5) {
							c.lots = c.lots.slice(0, 5);
							c.lots.push('…');
						}
						result.push({content: 'Lot' + (c.lots.length > 1 ? 's' : '') + ' ' + c.lots.join(',')});
					}
					result.push({icon: ICON.company, content: c.bidder.name || '[Name not available]', link: c.link});
				}
			);
			return result;
		}
	},
	{
		name: 'Award Decision Date',
		id: 'lots.awardDecisionDate',
		group: 'Tender Dates',
		sortBy: {
			id: 'lots.awardDecisionDate',
			ascend: false
		},
		format: tender => {
			if (!tender.lots) {
				return [];
			}
			let dates = {};
			tender.lots.forEach((lot: Lot, index_l: number) => {
				if (lot.awardDecisionDate) {
					dates[lot.awardDecisionDate] = dates[lot.awardDecisionDate] || {date: lot.awardDecisionDate, lots: []};
					dates[lot.awardDecisionDate].lots.push(index_l + 1);
				}
			});
			let result = [];
			let datekeys = Object.keys(dates);
			datekeys.forEach(key => {
					let c = dates[key];
					// if (tender.lots.length > 1 && datekeys.length > 1) {
					// 	result.push({content: 'Lot' + (c.lots.length > 1 ? 's' : '') + ' ' + c.lots.join(',')});
					// }
					if (c.lots.length > 5) {
						c.lots = c.lots.slice(0, 5);
						c.lots.push('…');
					}
					result.push({content: Utils.formatDate(c.date), hint: 'Lot' + (c.lots.length > 1 ? 's' : '') + ' ' + c.lots.join(',')});
				}
			);
			return result;
		}
	},
	{
		name: 'Buyer',
		id: 'buyers.name',
		group: 'Buyer',
		// sortBy: {
		// 	id: 'buyers.name.raw',
		// 	ascend: true
		// },
		format: tender => {
			if (!tender.buyers) {
				return [];
			}
			return tender.buyers.map((buyer: Buyer) => {
				return {icon: ICON.authority, content: buyer.name || '[Name not available]', link: '/authority/' + buyer.groupId};
			});
		}
	},
	{
		name: 'Administrators',
		id: 'administrators.name',
		group: 'Buyer',
		sortBy: {
			id: 'administrators.name.raw',
			ascend: true
		},
		format: tender => {
			if (!tender.administrators) {
				return [];
			}
			return tender.administrators.map((admin: Body) => {
				return {content: admin.name};
			});
		}
	},
	{
		name: 'Indicators',
		id: 'indicators',
		group: 'Tender Indicators',
		format: tender => {
			if (!tender.indicators) {
				return [];
			}
			let collect = {};

			tender.indicators.forEach(indicator => {
				let group = indicator.type.split('_')[0];
				let id = indicator.type.split('_').slice(1).join('_');
				collect[group] = collect[group] || {};
				collect[group][id] = (collect[group][id] || 0) + 1;
			});
			let result = [];
			Object.keys(collect).forEach(key => {
				result.push({prefix: Utils.formatIndicatorGroupName(key)});
				Object.keys(collect[key]).forEach(id => {
					result.push({list: true, content: Utils.expandUnderlined(id)});
				});
			});
			return result;
		}
	},
	{
		name: 'Corruption Risk Indicator',
		id: 'indicators.cri',
		group: 'Tender Indicators',
		format: tender => {
			if (!tender.indicators) {
				return [];
			}
			let result = [];
			tender.indicators.forEach(indicator => {
				let group = indicator.type.split('_')[0];
				let id = indicator.type.split('_').slice(1).join('_');
				if (group === 'CORRUPTION') {
					result.push({list: true, content: Utils.expandUnderlined(id)});
				}
			});
			return result;
		}
	},
	{
		name: 'Transparency Indicator',
		id: 'indicators.ti',
		group: 'Tender Indicators',
		format: tender => {
			if (!tender.indicators) {
				return [];
			}
			let result = [];
			tender.indicators.forEach(indicator => {
				let group = indicator.type.split('_')[0];
				let id = indicator.type.split('_').slice(1).join('_');
				if (group === 'TRANSPARENCY') {
					result.push({list: true, content: Utils.expandUnderlined(id)});
				}
			});
			return result;
		}
	},
	{
		name: 'Administrative Quality Indicator',
		id: 'indicators.aqi',
		group: 'Tender Indicators',
		format: tender => {
			if (!tender.indicators) {
				return [];
			}
			let result = [];
			tender.indicators.forEach(indicator => {
				let group = indicator.type.split('_')[0];
				let id = indicator.type.split('_').slice(1).join('_');
				if (group === 'ADMINISTRATIVE') {
					result.push({list: true, content: Utils.expandUnderlined(id)});
				}
			});
			return result;
		}
	},
	{
		name: 'CPV Code',
		id: 'cpvs',
		group: 'Tender Meta Data',
		sortBy: {
			id: 'cpvs.code',
			ascend: true
		},
		format: tender => {
			if (!tender.cpvs) {
				return [];
			}
			return tender.cpvs.map(cpv => {
				let result: TableLine = {content: cpv.code};
				if (cpv.isMain) {
					result.link = '/sector/' + cpv.code;
				}
				return result;
			});
		}
	},
	{
		name: 'Tender Country',
		id: 'country',
		group: 'Tender Meta Data',
		format: tender => {
			if (!tender.country) {
				return [];
			}
			return [{content: Utils.expandCountry(tender.country)}];
		}
	},
	{
		name: 'Eligible Bid Languages',
		id: 'eligibleBidLanguages',
		group: 'Tender',
		format: tender => {
			if (!tender.eligibleBidLanguages) {
				return [];
			}
			return tender.eligibleBidLanguages.map(lang => {
				return {content: lang};
			});
		}
	},
	{
		name: 'Final Price',
		id: 'finalPrice',
		group: 'Tender Prices',
		sortBy: {
			id: 'finalPrice.netAmount',
			ascend: false
		},
		format: tender => FormatUtils.formatPrice(tender.finalPrice)
	},
	{
		name: 'Estimated Price',
		id: 'estimatedPrice',
		group: 'Tender Prices',
		sortBy: {
			id: 'estimatedPrice.netAmount',
			ascend: false
		},
		format: tender => FormatUtils.formatPrice(tender.estimatedPrice)
	},
	{
		name: 'Documents Price',
		id: 'documentsPrice',
		group: 'Tender Prices',
		sortBy: {
			id: 'documentsPrice.netAmount',
			ascend: false
		},
		format: tender => FormatUtils.formatPrice(tender.documentsPrice)
	},
	{
		name: 'Bid Price',
		id: 'lots.bids.price',
		group: 'Tender Prices',
		format: tender => {
			if (!tender.lots) {
				return [];
			}
			let result = [];
			tender.lots.forEach((lot: Lot, index_l: number) => {
				if (lot.bids) {
					lot.bids.forEach((bid: Bid, index_b: number) => {
						if (bid.price) {
							let results = FormatUtils.formatPrice(bid.price);
							if (results.length > 0) {
								result.push({content: 'Lot ' + (index_l + 1) + ' Bid ' + (index_b + 1)});
								result = result.concat(results);
							}
						}
					});
				}
			});
			return result;
		}
	},
	{
		name: 'Tender Title',
		id: 'title',
		group: 'Tender',
		sortBy: {
			id: 'title.raw',
			ascend: true
		},
		format: tender => [{content: tender.title}]
	},
	{
		name: 'Tender Title English',
		id: 'titleEnglish',
		group: 'Tender',
		sortBy: {
			id: 'titleEnglish.raw',
			ascend: true
		},
		format: tender => [{content: tender.titleEnglish}]
	},
	{
		name: 'Tender Description',
		id: 'description',
		group: 'Tender',
		sortBy: {
			id: 'description.raw',
			ascend: true
		},
		format: tender => [{content: tender.description}]
	},
	{
		name: 'Appeal Body Name',
		id: 'appealBodyName',
		group: 'Authority',
		sortBy: {
			id: 'appealBodyName.raw',
			ascend: true
		},
		format: tender => [{content: tender.appealBodyName}]
	},
	{
		name: 'Mediation Body Name',
		id: 'mediationBodyName',
		group: 'Authority',
		sortBy: {
			id: 'mediationBodyName.raw',
			ascend: true
		},
		format: tender => [{content: tender.mediationBodyName}]
	},
	{
		name: 'Deposits',
		id: 'deposits',
		group: 'Tender Requirements',
		format: tender => [{content: tender.deposits}],
		right: true
	},
	{
		name: 'Personal Requirements',
		id: 'personalRequirements',
		group: 'Tender Requirements',
		format: tender => [{content: tender.personalRequirements}]
	},
	{
		name: 'Economic Requirements',
		id: 'economicRequirements',
		group: 'Tender Requirements',
		format: tender => [{content: tender.economicRequirements}]
	},
	{
		name: 'Technical Requirements',
		id: 'technicalRequirements',
		group: 'Tender Requirements',
		format: tender => [{content: tender.technicalRequirements}]
	},
	{
		name: 'Procedure Type',
		id: 'procedureType',
		group: 'Tender',
		sortBy: {
			id: 'procedureType',
			ascend: true
		},
		format: tender => [{content: Utils.expandUnderlined(tender.procedureType)}]
	},
	{
		name: 'Supply Type',
		id: 'supplyType',
		group: 'Tender',
		sortBy: {
			id: 'supplyType',
			ascend: true
		},
		format: tender => [{content: Utils.expandUnderlined(tender.supplyType)}]
	},
	{
		name: 'Estimated Start Date',
		id: 'estimatedStartDate',
		group: 'Tender Dates',
		sortBy: {
			id: 'estimatedStartDate',
			ascend: false
		},
		format: tender => [{content: Utils.formatDate(tender.estimatedStartDate)}]
	},
	{
		name: 'Estimated Completion Date',
		id: 'estimatedCompletionDate',
		group: 'Tender Dates',
		sortBy: {
			id: 'estimatedCompletionDate',
			ascend: false
		},
		format: tender => [{content: Utils.formatDate(tender.estimatedCompletionDate)}]
	},
	{
		name: 'Bid Deadline',
		id: 'bidDeadline',
		group: 'Tender Dates',
		sortBy: {
			id: 'bidDeadline',
			ascend: false
		},
		format: tender => [{content: Utils.formatDatetime(tender.bidDeadline)}]
	},
	{
		name: 'Documents Deadline',
		id: 'documentsDeadline',
		group: 'Tender Dates',
		sortBy: {
			id: 'documentsDeadline',
			ascend: false
		},
		format: tender => [{content: Utils.formatDatetime(tender.documentsDeadline)}]
	},
	{
		name: 'Creation Date',
		id: 'created',
		group: 'Tender Meta Data',
		sortBy: {
			id: 'created',
			ascend: false
		},
		format: tender => [{content: Utils.formatDatetime(tender.created)}]
	},
	{
		name: 'Modification Date',
		id: 'modified',
		group: 'Tender Meta Data',
		sortBy: {
			id: 'modified',
			ascend: false
		},
		format: tender => [{content: Utils.formatDatetime(tender.modified)}]
	},
	{
		name: 'Tender Link',
		id: 'id',
		group: 'Tender',
		format: tender => [{icon: ICON.tender + ' icon-large', content: '', link: '/tender/' + tender.id}]
	}
];
