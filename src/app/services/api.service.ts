import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {ConfigService} from './config.service';
import {
	IApiGeoJSONResult, IApiResult, IAuthorityApiResult, IAuthoritySimilarApiResult, ICompanyApiResult, ICompanySimilarApiResult, INutsApiResult, IPortalsApiResult,
	IPortalsStatsApiResult, IRegionApiResult, ISchemaApiResult, ISearchAuthorityApiResult, ISearchCompanyApiResult, ISearchTenderApiResult,
	ISectorApiResult, ISectorsApiResult, IStatApiResult, IStatStatsApiResult, ITenderApiResult, IUsageApiResult
} from '../app.interfaces';

@Injectable()
export class ApiService {

	private absUrl = '';
	private actionUrl = '';
	private actionCountryUrl = '';
	private headers: Headers;

	constructor(private http: Http, private config: ConfigService) {
		this.absUrl = config.absUrl;
		this.actionUrl = (config.config.backendUrl || '') + '/api/';
		this.actionCountryUrl = this.actionUrl + (config.country.id || 'eu' ) + '/';
		this.headers = new Headers();
		this.headers.append('Content-Type', 'application/json');
		this.headers.append('Accept', 'application/json');
	}

	post(url, params: any) {
		if (this.config.locale) {
			params['lang'] = this.config.locale;
		}
		return this.http.post(this.actionCountryUrl + url, JSON.stringify(params), {headers: this.headers});
	}

	getIndicatorStats(params: any): Observable<IStatApiResult> {
		return this.post('indicators/stats', params).map(res => <IStatApiResult>res.json());
	}

	getSectorStats(params: any): Observable<ISectorApiResult> {
		return this.post('sector/stats', params).map(res => <ISectorApiResult>res.json());
	}

	getRegionStats(params: any): Observable<IRegionApiResult> {
		return this.post('region/stats', params).map(res => <IRegionApiResult>res.json());
	}

	getCompanyStats(params: any): Observable<IStatStatsApiResult> {
		return this.post('company/stats', params).map(res => <IStatStatsApiResult>res.json());
	}

	getAuthorityStats(params: any): Observable<IStatStatsApiResult> {
		return this.post('authority/stats', params).map(res => <IStatStatsApiResult>res.json());
	}

	getMarketAnalysisStats(params: any): Observable<IStatApiResult> {
		return this.post('market/stats', params).map(res => <IStatApiResult>res.json());
	}

	getHomeStats(params: any): Observable<IStatApiResult> {
		return this.post('home/stats', params).map(res => <IStatApiResult>res.json());
	}

	searchAuthority(params: any): Observable<ISearchAuthorityApiResult> {
		return this.post('authority/search', params).map(res => <ISearchAuthorityApiResult>res.json());
	}

	searchCompany(params: any): Observable<ISearchCompanyApiResult> {
		return this.post('company/search', params).map(res => <ISearchCompanyApiResult>res.json());
	}

	searchTender(params: any): Observable<ISearchTenderApiResult> {
		return this.post('tender/search', params).map(res => <ISearchTenderApiResult>res.json());
	}

	autocomplete(entity: string, field: string, search: string): Observable<IApiResult> {
		return this.post('autocomplete', {entity, field, search}).map(res => <IApiResult>res.json());
	}

	get(url: string) {
		let query = '';
		if (this.config.locale) {
			query = '?lang=' + this.config.locale;
		}
		return this.http.get(this.actionCountryUrl + url + query);
	}

	getFieldsUsage(): Observable<IUsageApiResult> {
		return this.get('quality/usage').map(res => <IUsageApiResult>res.json());
	}

	getSectors(): Observable<ISectorsApiResult> {
		return this.get('sector/list/main').map(res => <ISectorsApiResult>res.json());
	}

	getTender(id: string): Observable<ITenderApiResult> {
		return this.get('tender/id/' + id).map(res => <ITenderApiResult>res.json());
	}

	getCompany(id: string): Observable<ICompanyApiResult> {
		return this.get('company/id/' + id).map(res => <ICompanyApiResult>res.json());
	}

	getSector(id: string): Observable<ISectorApiResult> {
		return this.get('sector/id/' + id).map(res => <ISectorApiResult>res.json());
	}

	getCompanyNutsStats(): Observable<INutsApiResult> {
		return this.get('company/nuts').map(res => <INutsApiResult>res.json());
	}

	getCompanySimilar(id: string): Observable<ICompanySimilarApiResult> {
		return this.get('company/similar/' + id).map(res => <ICompanySimilarApiResult>res.json());
	}

	getAuthority(id: string): Observable<IAuthorityApiResult> {
		return this.get('authority/id/' + id).map(res => <IAuthorityApiResult>res.json());
	}

	getAuthorityNutsStats(): Observable<INutsApiResult> {
		return this.get('authority/nuts').map(res => <INutsApiResult>res.json());
	}

	getAuthoritySimilar(id: string): Observable<IAuthoritySimilarApiResult> {
		return this.get('authority/similar/' + id).map(res => <IAuthoritySimilarApiResult>res.json());
	}

	// country unspecific api gets from backend

	getPortalsStats(): Observable<IPortalsStatsApiResult> {
		return this.http.get(this.actionUrl + 'portals/stats').map(res => <IPortalsStatsApiResult>res.json());
	}

	getPortals(): Observable<IPortalsApiResult> {
		return this.http.get(this.actionUrl + 'portals/list').map(res => <IPortalsApiResult>res.json());
	}

	// country unspecific gets from frontend

	getDownloads(): Observable<IApiResult> {
		return this.http.get(this.absUrl + '/data/files/downloads.json').map(res => <IApiResult>res.json());
	}

	getSchema(): Observable<ISchemaApiResult> {
		return this.http.get(this.absUrl + '/data/schema.json').map(res => <ISchemaApiResult>res.json());
	}

	getNutsMap(level: number): Observable<IApiGeoJSONResult> {
		return this.http.get(this.absUrl + '/data/nuts' + level + '.geo.json').map(res => <IApiGeoJSONResult>res.json());
	}

	getPortalMapData(): Observable<IApiResult> {
		return this.http.get(this.absUrl + '/assets/data/portal-map.svg.json').map(res => <IApiResult>res.json());
	}

}


