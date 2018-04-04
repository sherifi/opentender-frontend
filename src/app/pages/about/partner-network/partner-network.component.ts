import {Component} from '@angular/core';
import * as partnerDefs from '../../../model/partner.json';
import {I18NService} from '../../../modules/i18n/services/i18n.service';
import {ConfigService} from '../../../services/config.service';

/**
 * The /about/partner-network component displays the partner-network list
 */

@Component({
	moduleId: __filename,
	selector: 'partner-network-about',
	templateUrl: 'partner-network.component.html',
	styleUrls: ['partner-network.component.scss']
})
export class AboutPartnerNetworkPage {
	public partnergroups: Array<{ country: string; name: string; isCurrent: boolean; partner: Array<IPartnerInfo>; }>;

	constructor(private i18n: I18NService, private config: ConfigService) {
		let collect: { [country: string]: Array<IPartnerInfo> } = {};
		partnerDefs.partner.forEach(partner => {
			collect[partner.country] = (collect[partner.country] || []);
			collect[partner.country].push(partner);
		});
		this.partnergroups = Object.keys(collect).map(key => {
			return {
				country: key,
				isCurrent: key === config.country.id,
				name: i18n.expandCountry(key),
				partner: collect[key]
			};
		}).sort((a, b) => {
			if (a.isCurrent) {
				return -1;
			}
			if (b.isCurrent) {
				return 1;
			}
			return a.name.localeCompare(b.name);
		});
	}
}
