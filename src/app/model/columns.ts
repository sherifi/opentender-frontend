/// <reference path="./tender.d.ts" />
import Tender = Definitions.Tender;
import Buyer = Definitions.Buyer;
import Body = Definitions.Body;
import Lot = Definitions.Lot;
import Bid = Definitions.Bid;
import {Utils} from './utils';
import {IAuthority, ICompany} from '../app.interfaces';
import Price = Definitions.Price;
import {Consts} from './consts';

const ICON = {
	tender: 'icon-newspaper',
	region: 'icon-location',
	authority: 'icon-library',
	company: 'icon-office'
};

export interface Column {
	name: string;
	id: string;
	group: string;
	sortBy?: ColumnSort;
}

export interface TableLine {
	content: string;
	link?: string;
	prefix?: string;
	list?: boolean;
	icon?: string;
}

export interface TableCell {
	align?: string;
	lines: Array<TableLine>;
}

export interface TableRow {
	cells: Array<TableCell>;
}

export interface Table {
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
		sortBy: {
			id: 'body.name.raw',
			ascend: true
		},
		format: authority => [{content: authority.body.name || '[Name not available]'}]
	},
	{
		name: 'City',
		id: 'body.address.city',
		group: 'Authority',
		sortBy: {
			id: 'body.address.city',
			ascend: true
		},
		format: authority => [{content: authority.body.address.city}]
	},
	{
		name: 'Country',
		id: 'body.address.country',
		group: 'Authority',
		sortBy: {
			id: 'body.address.country',
			ascend: true
		},
		format: authority => [{content: Utils.expandCountry(authority.body.address.country)}]
	},
	{
		name: 'Bids Count',
		id: 'count',
		group: 'Authority',
		format: authority => [{content: Utils.formatValue(authority.sources.length)}]
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
		sortBy: {
			id: 'body.name.raw',
			ascend: true
		},
		format: company => [{content: company.body.name || '[Name not available]'}]
	},
	{
		name: 'City',
		group: 'Company',
		id: 'body.address.city',
		sortBy: {
			id: 'body.address.city',
			ascend: true
		},
		format: company => [{content: company.body.address.city}]
	},
	{
		name: 'Country',
		group: 'Company',
		id: 'body.address.country',
		sortBy: {
			id: 'body.address.country',
			ascend: true
		},
		format: company => [{content: Utils.expandCountry(company.body.address.country)}]
	},
	{
		name: 'Bids Count',
		id: 'count',
		group: 'Company',
		format: company => [{content: Utils.formatValue(company.sources.length)}]
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
	formatPrice: (price: Price) => {
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
			if (price.hasOwnProperty(key) && price.currencyNational !== 'EUR') {
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
		name: 'Tender Link',
		id: 'id',
		group: 'Tender',
		format: tender => [{icon: ICON.tender + ' icon-large', content: '', link: '/tender/' + tender.id, align: 'center'}]
	},
	{
		name: 'Supplier',
		id: 'lots.bids.bidders.name',
		group: 'Supplier',
		// sortBy: {
		// 	id: 'lots.bids.bidders.name.raw',
		// 	ascend: true
		// },
		format: tender => {
			if (!tender.lots) {
				return [];
			}
			let companies = {};
			tender.lots.forEach((lot: Lot, index_l: number) => {
				if (lot.bids) {
					lot.bids.forEach((bid: Bid) => {
						if (bid.bidders) {
							bid.bidders.forEach((bidder: Body) => {
								companies[bidder.groupId] = companies[bidder.name] || {bidder: bidder, lots: [], link: '/company/' + bidder.groupId};
								companies[bidder.groupId].lots.push(index_l + 1);
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
		name: 'Buyer Region',
		id: 'buyer.address.nuts',
		group: 'Buyer',
		sortBy: {
			id: 'buyers.address.nuts',
			ascend: true
		},
		format: tender => {
			if (!tender.buyers) {
				return [];
			}
			let result: Array<TableLine> = [];
			tender.buyers.forEach((buyer: Buyer) => {
				if (buyer.address && buyer.address.nuts) {
					buyer.address.nuts.forEach(nut => {
						if (nut) {
							result.push({icon: ICON.region, content: nut, link: '/region/' + nut});
						}
					});
				}
			});
			return result;
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
		name: 'Appeal Body Name',
		id: 'appealBodyName',
		group: 'Buyer',
		sortBy: {
			id: 'appealBodyName.raw',
			ascend: true
		},
		format: tender => [{content: tender.appealBodyName}]
	},
	{
		name: 'Mediation Body Name',
		id: 'mediationBodyName',
		group: 'Buyer',
		sortBy: {
			id: 'mediationBodyName.raw',
			ascend: true
		},
		format: tender => [{content: tender.mediationBodyName}]
	},

	{
		name: 'Indicators',
		id: 'indicators',
		group: 'Indicators',
		format: tender => {
			if (!tender.indicators) {
				return [];
			}
			let collect = {};

			tender.indicators.forEach(indicator => {
				let info = Utils.getIndicatorInfo(indicator.type);
				if (info) {
					collect[info.group.id] = collect[info.group.id] || [];
					collect[info.group.id].push(info);
				}
			});
			let result = [];
			Object.keys(collect).forEach(key => {
				let infos = collect[key];
				result.push({prefix: infos[0].group.name});
				infos.forEach(info => {
					result.push({styleClass: 'badge-' + info.group.id, content: info.indicator.name, hint: info.indicator.desc});
				});
			});
			return result;
		}
	},
	{
		name: 'Procurement Integrity Indicator',
		id: 'indicators.pii',
		group: 'Indicators',
		format: tender => {
			if (!tender.indicators) {
				return [];
			}
			let result = [];
			tender.indicators.forEach(indicator => {
				let group = indicator.type.split('_')[0];
				if (group === Consts.indicators.CORRUPTION.id) {
					let def = Consts.indicators.CORRUPTION.subindicators[indicator.type];
					if (def) {
						result.push({styleClass: 'badge-' + Consts.indicators.CORRUPTION.id, content: def.name, hint: def.desc});
					}
				}
			});
			return result;
		}
	},
	{
		name: 'Transparency Indicator',
		id: 'indicators.ti',
		group: 'Indicators',
		format: tender => {
			if (!tender.indicators) {
				return [];
			}
			let result = [];
			tender.indicators.forEach(indicator => {
				let group = indicator.type.split('_')[0];
				if (group === Consts.indicators.TRANSPARENCY.id) {
					let def = Consts.indicators.TRANSPARENCY.subindicators[indicator.type];
					if (def) {
						result.push({styleClass: 'badge-' + Consts.indicators.TRANSPARENCY.id, content: def.name, hint: def.desc});
					}
				}
			});
			return result;
		}
	},
	{
		name: 'Administrative Capacity Indicator',
		id: 'indicators.aci',
		group: 'Indicators',
		format: tender => {
			if (!tender.indicators) {
				return [];
			}
			let result = [];
			tender.indicators.forEach(indicator => {
				let group = indicator.type.split('_')[0];
				if (group === Consts.indicators.ADMINISTRATIVE.id) {
					let def = Consts.indicators.ADMINISTRATIVE.subindicators[indicator.type];
					if (def) {
						result.push({styleClass: 'badge-' + Consts.indicators.ADMINISTRATIVE.id, content: def.name, hint: def.desc});
					}
				}
			});
			return result;
		}
	},

	{
		name: 'Main Sector',
		id: 'cpvs.main.names',
		group: 'Sector',
		sortBy: {
			id: 'cpvs.code',
			ascend: true
		},
		format: tender => {
			if (!tender.cpvs) {
				return [];
			}
			return tender.cpvs.filter(cpv => cpv.isMain).map(cpv => {
				return {content: cpv['name'] || cpv.code, link: '/sector/' + cpv.code};
			});
		}
	},
	{
		name: 'Sectors',
		id: 'cpvs.names',
		group: 'Sector',
		sortBy: {
			id: 'cpvs.code',
			ascend: true
		},
		format: tender => {
			if (!tender.cpvs) {
				return [];
			}
			return tender.cpvs.map(cpv => {
				return {list: true, content: cpv['name'] || cpv.code, link: '/sector/' + cpv.code};
			});
		}
	},
	{
		name: 'Main CPV Code',
		id: 'cpvs.main.codes',
		group: 'Sector',
		sortBy: {
			id: 'cpvs.code',
			ascend: true
		},
		format: tender => {
			if (!tender.cpvs) {
				return [];
			}
			return tender.cpvs.filter(cpv => cpv.isMain).map(cpv => {
				return {content: cpv.code, link: '/sector/' + cpv.code};
			});
		}
	},
	{
		name: 'CPV Codes',
		id: 'cpvs.codes',
		group: 'Sector',
		sortBy: {
			id: 'cpvs.code',
			ascend: true
		},
		format: tender => {
			if (!tender.cpvs) {
				return [];
			}
			return tender.cpvs.map(cpv => {
				return {list: true, content: cpv.code, link: '/sector/' + cpv.code};
			});
		}
	},

	{
		name: 'Title',
		id: 'title',
		group: 'Tender',
		sortBy: {
			id: 'title.raw',
			ascend: true
		},
		format: tender => [{content: tender.title}]
	},
	{
		name: 'Title English',
		id: 'titleEnglish',
		group: 'Tender',
		sortBy: {
			id: 'titleEnglish.raw',
			ascend: true
		},
		format: tender => [{content: tender.titleEnglish}]
	},
	{
		name: 'Description',
		id: 'description',
		group: 'Tender',
		sortBy: {
			id: 'description.raw',
			ascend: true
		},
		format: tender => [{content: tender.description}]
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
		name: 'Final Price',
		id: 'finalPrice',
		group: 'Prices',
		sortBy: {
			id: 'finalPrice.netAmount',
			ascend: false
		},
		format: tender => FormatUtils.formatPrice(tender.finalPrice)
	},
	{
		name: 'Estimated Price',
		id: 'estimatedPrice',
		group: 'Prices',
		sortBy: {
			id: 'estimatedPrice.netAmount',
			ascend: false
		},
		format: tender => FormatUtils.formatPrice(tender.estimatedPrice)
	},
	{
		name: 'Documents Price',
		id: 'documentsPrice',
		group: 'Prices',
		sortBy: {
			id: 'documentsPrice.netAmount',
			ascend: false
		},
		format: tender => FormatUtils.formatPrice(tender.documentsPrice)
	},
	{
		name: 'Bid Price',
		id: 'lots.bids.price',
		group: 'Prices',
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
		name: 'Eligible Bid Languages',
		id: 'eligibleBidLanguages',
		group: 'Tender Requirements',
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
		name: 'Deposits',
		id: 'deposits',
		group: 'Tender Requirements',
		format: tender => [{content: tender.deposits}]
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
		name: 'Award Decision Date',
		id: 'lots.awardDecisionDate',
		group: 'Dates',
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
		name: 'Estimated Start Date',
		id: 'estimatedStartDate',
		group: 'Dates',
		sortBy: {
			id: 'estimatedStartDate',
			ascend: false
		},
		format: tender => [{content: Utils.formatDate(tender.estimatedStartDate)}]
	},
	{
		name: 'Estimated Completion Date',
		id: 'estimatedCompletionDate',
		group: 'Dates',
		sortBy: {
			id: 'estimatedCompletionDate',
			ascend: false
		},
		format: tender => [{content: Utils.formatDate(tender.estimatedCompletionDate)}]
	},
	{
		name: 'Bid Deadline',
		id: 'bidDeadline',
		group: 'Dates',
		sortBy: {
			id: 'bidDeadline',
			ascend: false
		},
		format: tender => [{content: Utils.formatDatetime(tender.bidDeadline)}]
	},
	{
		name: 'Documents Deadline',
		id: 'documentsDeadline',
		group: 'Dates',
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
		name: 'Country',
		id: 'country',
		group: 'Tender Meta Data',
		format: tender => {
			if (!tender.country) {
				return [];
			}
			return [{content: Utils.expandCountry(tender.country)}];
		}
	}

];
