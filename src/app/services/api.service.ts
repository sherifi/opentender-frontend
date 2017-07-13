import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {ConfigService} from './config.service';
import Tender = Definitions.Tender;
import Body = Definitions.Body;
import {CountryService} from './country.service';
import Bidder = Definitions.Bidder;
import Buyer = Definitions.Buyer;
import {
	ISector, ICountryStats, IUsageEntry, ICompany, IStats, IAuthority, ISearchCompanyData,
	ISearchAuthorityData, ISearchTenderData, IVizData
} from '../app.interfaces';

export interface VizResult {
	viz: any;
}


/* api-transfer-packages */

export interface ITenderApiResult {
	data: Tender;
}

export interface ISectorsApiResult {
	data: Array<ISector>;
}

export interface IPortalsStatsApiResult {
	data: ICountryStats;
}

export interface IUsageApiResult {
	data: Array<IUsageEntry>;
}

export interface ICompanyApiResult {
	data: {
		company: ICompany;
	};
}

export interface ICompanyStatsApiResult {
	data: {
		stats: IStats;
	};
}

export interface ICompanySimilarApiResult {
	data: {
		similar: Array<ICompany>;
	};
}

export interface IAuthorityApiResult {
	data: {
		authority: IAuthority;
	};
}

export interface IAuthorityApiStatsResult {
	data: {
		stats: IStats;
	};
}

export interface IAuthoritySimilarApiResult {
	data: {
		similar: Array<IAuthority>;
	};
}

export interface ISectorApiResult {
	data: {
		sector: ISector;
		parent?: ISector;
		stats: IStats;
	};
}

export interface ISchemaApiResult {
	data: any;
}

export interface ISearchCompanyApiResult {
	data: ISearchCompanyData;
}

export interface ISearchAuthorityApiResult {
	data: ISearchAuthorityData;
}

export interface ISearchTenderApiResult {
	data: ISearchTenderData;
}

export interface IStatApiResult {
	data: IStats;
}

export interface IVizApiResult {
	data: IVizData;
}

export interface IApiResult {
	data: any;
}


@Injectable()
export class ApiService {

	private absUrl = '';
	private actionUrl = '';
	private actionCountryUrl = '';
	private headers: Headers;

	constructor(private http: Http, private config: ConfigService, private countryService: CountryService) {
		this.absUrl = config.absUrl;
		// console.log('using absolute url', this.absUrl);
		// console.log('using backendUrl', config.get('backendUrl'));
		this.actionUrl = config.get('backendUrl') + '/api/';
		this.actionCountryUrl = this.actionUrl + (countryService.get().id || 'eu' ) + '/';
		this.headers = new Headers();
		this.headers.append('Content-Type', 'application/json');
		this.headers.append('Accept', 'application/json');
	}

	getNutsMap(): Observable<IApiResult> {
		return this.http.get(this.absUrl + '/data/nuts1.geojson').map(res => <IApiResult>res.json());
	}

	getDownloads(): Observable<IApiResult> {
		return this.http.get(this.absUrl + '/files/downloads.json').map(res => <IApiResult>res.json());
	}

	getPortalMapData(): Observable<IApiResult> {
		return this.http.get(this.absUrl + '/assets/data/portal-map.svg.json').map(res => <IApiResult>res.json());
	}

	getSchema(): Observable<ISchemaApiResult> {
		return this.http.get(this.absUrl + '/assets/schema.json').map(res => <ISchemaApiResult>res.json());
	}

	getPortalsStats(): Observable<IPortalsStatsApiResult> {
		return this.http.get(this.actionUrl + 'portals/countries-stats').map(res => <IPortalsStatsApiResult>res.json());
	}

	getUsage(): Observable<IUsageApiResult> {
		return this.http.get(this.actionCountryUrl + 'quality/usage').map(res => <IUsageApiResult>res.json());
	}

	getSectors(): Observable<ISectorsApiResult> {
		return this.http.get(this.actionCountryUrl + 'sector/list/main').map(res => <ISectorsApiResult>res.json());
	}

	getTender(id: string): Observable<ITenderApiResult> {
		return this.http.get(this.actionCountryUrl + 'tender/id/' + id).map(res => <ITenderApiResult>res.json());
	}

	getCompany(id: string): Observable<ICompanyApiResult> {
		return this.http.get(this.actionCountryUrl + 'company/id/' + id).map(res => <ICompanyApiResult>res.json());
	}

	getCompanyStats(ids: Array<string>): Observable<ICompanyStatsApiResult> {
		return this.http.post(this.actionCountryUrl + 'company/stats', JSON.stringify({ids: ids}), {headers: this.headers}).map(res => <ICompanyStatsApiResult>res.json());
	}

	getCompanySimilar(id: string): Observable<ICompanySimilarApiResult> {
		return this.http.get(this.actionCountryUrl + 'company/similar/' + id).map(res => <ICompanySimilarApiResult>res.json());
	}

	getAuthority(id: string): Observable<IAuthorityApiResult> {
		return this.http.get(this.actionCountryUrl + 'authority/id/' + id).map(res => <IAuthorityApiResult>res.json());
	}

	getAuthorityStats(ids: Array<string>): Observable<IAuthorityApiStatsResult> {
		return this.http.post(this.actionCountryUrl + 'authority/stats', JSON.stringify({ids: ids}), {headers: this.headers}).map(res => <IAuthorityApiStatsResult>res.json());
	}

	getAuthoritySimilar(id: string): Observable<IAuthoritySimilarApiResult> {
		return this.http.get(this.actionCountryUrl + 'authority/similar/' + id).map(res => <IAuthoritySimilarApiResult>res.json());
	}

	getSector(id: string): Observable<ISectorApiResult> {
		return this.http.get(this.actionCountryUrl + 'sector/id/' + id).map(res => <ISectorApiResult>res.json());
	}

	searchAuthority(params: any): Observable<ISearchAuthorityApiResult> {
		return this.http.post(this.actionCountryUrl + 'authority/search', JSON.stringify(params), {headers: this.headers}).map(res => <ISearchAuthorityApiResult>res.json());
	}

	searchCompany(params: any): Observable<ISearchCompanyApiResult> {
		return this.http.post(this.actionCountryUrl + 'company/search', JSON.stringify(params), {headers: this.headers}).map(res => <ISearchCompanyApiResult>res.json());
	}

	searchTender(params: any): Observable<ISearchTenderApiResult> {
		return this.http.post(this.actionCountryUrl + 'tender/search', JSON.stringify(params), {headers: this.headers}).map(res => <ISearchTenderApiResult>res.json());
	}

	getIndicatorStats(params: any): Observable<IStatApiResult> {
		return this.http.post(this.actionCountryUrl + 'indicators/stats/', JSON.stringify(params), {headers: this.headers}).map(res => <IStatApiResult>res.json());
	}

	getViz(ids: Array<string>): Observable<IVizApiResult> {
		return this.http.get(this.actionCountryUrl + 'viz/ids/' + ids.join(',')).map(res => <IVizApiResult>res.json());
	}

	autocomplete(entity: string, field: string, search: string): Observable<IVizApiResult> {
		return this.http.post(this.actionCountryUrl + 'autocomplete', JSON.stringify({entity: entity, field: field, search: search}), {headers: this.headers}).map(res => <IApiResult>res.json());
	}
}


