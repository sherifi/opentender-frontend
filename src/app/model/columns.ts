/// <reference path="./tender.d.ts" />
import Bidder = Definitions.Bidder;
import Buyer = Definitions.Buyer;
import Price = Definitions.Price;
import Lot = Definitions.Lot;
import Bid = Definitions.Bid;
import {ITableColumnAuthority, ITableColumnCompany, ITableColumnTender, ITableCellLine} from '../app.interfaces';
import {Consts} from './consts';
import {Utils} from './utils';

const ICON = {
	tender: 'icon-newspaper',
	region: 'icon-location',
	authority: 'icon-library',
	company: 'icon-office'
};

const ColumnsFormatUtils = {
	formatPriceEURValue: (value: number) => {
		return Utils.formatCurrency('EUR') + '\u00a0' + Utils.formatCurrencyValue(value).replace(/ /g, '\u00a0');
	},
	formatPriceEUR: (price: Price) => {
		if (price && price.hasOwnProperty('netAmountEur')) {
			return [{content: ColumnsFormatUtils.formatPriceEURValue(price.netAmountEur)}];
		}
		return [];
	},
	formatTenderIndicatorGroup: (tender, group) => {
		if (!tender.indicators) {
			return [];
		}
		let result: Array<ITableCellLine> = [];
		tender.scores.forEach(score => {
			if (score.status === 'CALCULATED' && score.type === group.id) {
				let collapseLines: Array<ITableCellLine> = [];
				tender.indicators.forEach(indicator => {
					let group_id = indicator.type.split('_')[0];
					if (indicator.status === 'CALCULATED' && group_id === group.id) {
						let def = group.subindicators[indicator.type];
						if (def) {
							collapseLines.push({styleClass: 'badge-' + group.id, content: def.name + ': ' + Utils.formatValue(indicator.value), hint: def.desc});
						}
					}
				});
				result.push({content: 'Score: ' + Utils.formatValue(score.value), hint: group.name, collapseLines: collapseLines});
			}
		});
		return result;
	}
};

export const AuthorityColumns: Array<ITableColumnAuthority> = [
	{
		name: 'Name',
		id: 'body.name',
		group: 'Authority',
		sortBy: {
			id: 'body.name.raw',
			ascend: true
		},
		format: authority => [{content: Utils.nameGuard(authority.body.name)}]
	},
	{
		name: 'City',
		id: 'body.address.city',
		group: 'Authority',
		sortBy: {
			id: 'body.address.city',
			ascend: true
		},
		format: authority => authority.body && authority.body.address ? [{content: authority.body.address.city}] : []
	},
	{
		name: 'Country',
		id: 'body.address.country',
		group: 'Authority',
		sortBy: {
			id: 'body.address.country',
			ascend: true
		},
		format: authority => authority.body && authority.body.address ? [{content: Utils.expandCountry(authority.body.address.country)}] : []
	},
	{
		name: 'Bids Count',
		id: 'count',
		group: 'Authority',
		format: authority => [{content: Utils.formatValue(authority.sources.length)}]
	},
	{
		name: 'Main Activities',
		id: 'body.mainActivities',
		group: 'Authority',
		sortBy: {
			id: 'body.mainActivities',
			ascend: true
		},
		format: authority => {
			return (authority.body.mainActivities || []).map(activity => {
				return {content: Utils.expandUnderlined(activity)};
			});
		}
	},
	{
		name: 'Buyer Type',
		id: 'body.buyerType',
		group: 'Authority',
		sortBy: {
			id: 'body.buyerType',
			ascend: true
		},
		format: authority => [{content: Utils.expandUnderlined(authority.body.buyerType)}]
	},
	{
		name: 'Profile Link',
		id: 'id',
		group: 'Authority',
		format: authority => [{icon: ICON.authority + ' icon-large', content: '', link: '/authority/' + authority.body.id, hint: ('Profile Page ' + Utils.nameGuard(authority.body.name)), align: 'center'}]
	}
];

export const CompanyColumns: Array<ITableColumnCompany> = [
	{
		name: 'Name',
		group: 'Company',
		id: 'body.name',
		sortBy: {
			id: 'body.name.raw',
			ascend: true
		},
		format: company => [{content: Utils.nameGuard(company.body.name)}]
	},
	{
		name: 'City',
		group: 'Company',
		id: 'body.address.city',
		sortBy: {
			id: 'body.address.city',
			ascend: true
		},
		format: company => company.body && company.body.address ? [{content: company.body.address.city}] : []
	},
	{
		name: 'Country',
		group: 'Company',
		id: 'body.address.country',
		sortBy: {
			id: 'body.address.country',
			ascend: true
		},
		format: company => company.body && company.body.address ? [{content: Utils.expandCountry(company.body.address.country)}] : []
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
		format: company => [{icon: ICON.company + ' icon-large', content: '', link: '/company/' + company.body.id, hint: ('Profile Page ' + Utils.nameGuard(company.body.name)), align: 'center'}]
	}
];

export const TenderColumns: Array<ITableColumnTender> = [
	{
		name: 'Tender Link',
		id: 'id',
		group: 'Tender',
		format: tender => [{icon: ICON.tender + ' icon-large', content: '', link: '/tender/' + tender.id, hint: 'Tender Page ' + tender.title, align: 'center'}]
	},
	{
		name: 'Supplier',
		id: 'lots.bids.bidders.name',
		group: 'Supplier',
		sortBy: {
			id: 'lots.bids.bidders.name.slug',
			ascend: true
		},
		format: tender => {
			if (!tender.lots) {
				return [];
			}
			let companies = {};
			tender.lots.forEach((lot: Lot, index_l: number) => {
				if (lot.bids) {
					lot.bids.forEach((bid: Bid) => {
						if (bid.bidders) {
							bid.bidders.forEach((bidder: Bidder) => {
								companies[bidder.id] = companies[bidder.name] || {bidder: bidder, lots: [], hint: ('Profile Page ' + Utils.nameGuard(bidder.name)), link: '/company/' + bidder.id};
								companies[bidder.id].lots.push(index_l + 1);
							});
						}
					});
				}
			});
			let result: Array<ITableCellLine> = [];
			Object.keys(companies).forEach(key => {
					let c = companies[key];
					if (tender.lots.length > 1) {
						if (c.lots.length > 5) {
							c.lots = c.lots.slice(0, 5);
							c.lots.push('…');
						}
						result.push({prefix: 'Lot' + (c.lots.length > 1 ? 's' : '') + ' ' + c.lots.join(',')});
					}
					result.push({icon: ICON.company, content: Utils.nameGuard(c.bidder.name), hint: ('Profile Page ' + Utils.nameGuard(c.bidder.name)), link: c.link});
				}
			);
			return result;
		}
	},
	{
		name: 'Supplier Region',
		id: 'lots.bids.bidder.address.nuts',
		group: 'Supplier',
		sortBy: {
			id: 'lots.bids.bidder.address.nuts',
			ascend: true
		},
		format: tender => {
			if (!tender.lots) {
				return [];
			}
			let result: Array<ITableCellLine> = [];
			tender.lots.forEach((lot: Lot) => {
				if (lot.bids) {
					lot.bids.forEach((bid: Bid) => {
						if (bid.bidders) {
							bid.bidders.forEach((bidder: Bidder) => {
								if (bidder.address && bidder.address.nuts) {
									bidder.address.nuts.forEach(nut => {
										if (nut) {
											result.push({icon: ICON.region, content: nut, hint: ('Region Page NUTS Code' + nut), link: '/region/' + nut});
										}
									});
								}
							});
						}
					});
				}
			});
			return result;
		}
	},
	{
		name: 'Buyer',
		id: 'buyers.name',
		group: 'Buyer',
		sortBy: {
			id: 'buyers.name.slug',
			ascend: true
		},
		format: tender => {
			if (!tender.buyers) {
				return [];
			}
			return tender.buyers.map((buyer: Buyer) => {
				return {icon: ICON.authority, content: Utils.nameGuard(buyer.name), hint: ('Profile Page ' + buyer.name || '[Name not available]'), link: '/authority/' + buyer.id};
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
			let result: Array<ITableCellLine> = [];
			tender.buyers.forEach((buyer: Buyer) => {
				if (buyer.address && buyer.address.nuts) {
					buyer.address.nuts.forEach(nut => {
						if (nut) {
							result.push({icon: ICON.region, content: nut, hint: ('Region Page NUTS Code' + nut), link: '/region/' + nut});
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
			return tender.administrators.map((admin: Buyer) => {
				return {content: admin.name};
			});
		}
	},
	{
		name: 'Appeal Body Name',
		id: 'appealBodyName',
		group: 'Buyer',
		sortBy: {
			id: 'appealBodyName',
			ascend: true
		},
		format: tender => [{content: tender.appealBodyName}]
	},
	{
		name: 'Mediation Body Name',
		id: 'mediationBodyName',
		group: 'Buyer',
		sortBy: {
			id: 'mediationBodyName',
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
			let result: Array<ITableCellLine> = [];
			tender.scores.forEach(score => {
				if (score.status === 'CALCULATED' && score.type === 'TENDER') {
					result.push({prefix: 'Good Procurement'});
					result.push({content: 'Score: ' + Utils.formatValue(score.value)});
				}
			});
			Object.keys(Consts.indicators).forEach(key => {
				let group = Consts.indicators[key];
				let list = ColumnsFormatUtils.formatTenderIndicatorGroup(tender, group);
				if (list.length > 0) {
					result.push({prefix: group.name});
					result = result.concat(list);
				}
			});
			return result;
		}
	},
	{
		name: 'Procurement Integrity Indicator',
		id: 'indicators.pii',
		group: 'Indicators',
		format: tender => {
			return ColumnsFormatUtils.formatTenderIndicatorGroup(tender, Consts.indicators.CORRUPTION);
		}
	},
	{
		name: 'Transparency Indicator',
		id: 'indicators.ti',
		group: 'Indicators',
		format: tender => {
			return ColumnsFormatUtils.formatTenderIndicatorGroup(tender, Consts.indicators.TRANSPARENCY);
		}
	},
	{
		name: 'Administrative Capacity Indicator',
		id: 'indicators.aci',
		group: 'Indicators',
		format: tender => {
			return ColumnsFormatUtils.formatTenderIndicatorGroup(tender, Consts.indicators.ADMINISTRATIVE);
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
				return {content: cpv['name'] || cpv.code, hint: 'Sector Page ' + cpv['name'], link: '/sector/' + cpv.code};
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
				return {list: true, content: cpv['name'] || cpv.code, hint: 'Sector Page ' + cpv['name'], link: '/sector/' + cpv.code};
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
				return {content: cpv.code, hint: 'Sector Page ' + cpv['name'], link: '/sector/' + cpv.code};
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
				return {list: true, content: cpv.code, hint: 'Sector Page ' + cpv['name'], link: '/sector/' + cpv.code};
			});
		}
	},
	{
		name: 'EU-Fund',
		id: 'fundings.isEuFund',
		group: 'Funding',
		sortBy: {
			id: 'fundings.isEuFund',
			ascend: true
		},
		format: tender => {
			if (!tender.fundings) {
				return [];
			}
			let list = tender.fundings.filter(funding => funding.isEuFund);
			return list.map(funding => {
				return {list: list.length > 1, prefix: 'EU-Fund', content: Utils.nameGuard(funding.programme)};
			});
		}
	},
	{
		name: 'Programme',
		id: 'fundings.programme',
		group: 'Funding',
		sortBy: {
			id: 'fundings.programme',
			ascend: true
		},
		format: tender => {
			if (!tender.fundings) {
				return [];
			}
			let list = tender.fundings.filter(funding => funding.programme);
			return list.map(funding => {
				return {list: list.length > 1, prefix: funding.isEuFund ? 'EU-Fund' : null, content: funding.programme};
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
			id: 'description',
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
			id: 'finalPrice.netAmountEur',
			ascend: false
		},
		format: tender => ColumnsFormatUtils.formatPriceEUR(tender.finalPrice)
	},
	{
		name: 'Estimated Price',
		id: 'estimatedPrice',
		group: 'Prices',
		sortBy: {
			id: 'estimatedPrice.netAmountEur',
			ascend: false
		},
		format: tender => ColumnsFormatUtils.formatPriceEUR(tender.estimatedPrice)
	},
	{
		name: 'Documents Price',
		id: 'documentsPrice',
		group: 'Prices',
		sortBy: {
			id: 'documentsPrice.netAmountEur',
			ascend: false
		},
		format: tender => ColumnsFormatUtils.formatPriceEUR(tender.documentsPrice)
	},
	{
		name: 'Bid Price',
		id: 'lots.bids.price',
		group: 'Prices',
		sortBy: {
			id: 'lots.bids.price.netAmountEur',
			ascend: false
		},
		format: tender => {
			if (!tender.lots) {
				return [];
			}
			let result: Array<ITableCellLine> = [];
			tender.lots.forEach((lot: Lot, index_l: number) => {
				if (lot.bids) {
					lot.bids.forEach((bid: Bid, index_b: number) => {
						if (bid.price && bid.price.netAmountEur) {
							result.push({
								prefix: (tender.lots.length ? 'Lot ' + (index_l + 1) : '') + (lot.bids.length > 1 ? ' Bid ' + (index_b + 1) : ''),
								content: ColumnsFormatUtils.formatPriceEURValue(bid.price.netAmountEur)
							});
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
			let result: Array<ITableCellLine> = [];
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
