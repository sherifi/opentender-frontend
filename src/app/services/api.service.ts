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

	getIndicatorStats(params: any): Observable<IStatApiResult> {
		return this.http.post(this.actionCountryUrl + 'indicators/stats', JSON.stringify(params), {headers: this.headers}).map(res => <IStatApiResult>res.json());
	}

	getSectorStats(params: any): Observable<ISectorApiResult> {
		return this.http.post(this.actionCountryUrl + 'sector/stats', JSON.stringify(params), {headers: this.headers}).map(res => <ISectorApiResult>res.json());
	}

	getRegionStats(params: any): Observable<IRegionApiResult> {
		return this.http.post(this.actionCountryUrl + 'region/stats', JSON.stringify(params), {headers: this.headers}).map(res => <IRegionApiResult>res.json());
	}

	getCompanyStats(params: any): Observable<IStatStatsApiResult> {
		return this.http.post(this.actionCountryUrl + 'company/stats', JSON.stringify(params), {headers: this.headers}).map(res => <IStatStatsApiResult>res.json());
	}

	getAuthorityStats(params: any): Observable<IStatStatsApiResult> {
		return this.http.post(this.actionCountryUrl + 'authority/stats', JSON.stringify(params), {headers: this.headers}).map(res => <IStatStatsApiResult>res.json());
	}

	getMarketAnalysisStats(params: any): Observable<IStatApiResult> {
		return this.http.post(this.actionCountryUrl + 'market/stats', JSON.stringify(params), {headers: this.headers}).map(res => <IStatApiResult>res.json());
	}

	getHomeStats(params: any): Observable<IStatApiResult> {
		return this.http.post(this.actionCountryUrl + 'home/stats', JSON.stringify(params), {headers: this.headers}).map(res => <IStatApiResult>res.json());
	}

	getNutsMap(level: number): Observable<IApiGeoJSONResult> {
		return this.http.get(this.absUrl + '/data/nuts' + level + '.geojson').map(res => <IApiGeoJSONResult>res.json());
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
		return this.http.get(this.actionUrl + 'portals/stats').map(res => <IPortalsStatsApiResult>res.json());
	}

	getPortals(): Observable<IPortalsApiResult> {
		return this.http.get(this.actionUrl + 'portals/list').map(res => <IPortalsApiResult>res.json());
	}

	getFieldsUsage(): Observable<IUsageApiResult> {
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

	getSector(id: string): Observable<ISectorApiResult> {
		return this.http.get(this.actionCountryUrl + 'sector/id/' + id).map(res => <ISectorApiResult>res.json());
	}

	getCompanyNutsStats(): Observable<INutsApiResult> {
		return this.http.get(this.actionCountryUrl + 'company/nuts').map(res => <INutsApiResult>res.json());
	}

	getCompanySimilar(id: string): Observable<ICompanySimilarApiResult> {
		return this.http.get(this.actionCountryUrl + 'company/similar/' + id).map(res => <ICompanySimilarApiResult>res.json());
	}

	getAuthority(id: string): Observable<IAuthorityApiResult> {
		return this.http.get(this.actionCountryUrl + 'authority/id/' + id).map(res => <IAuthorityApiResult>res.json());
	}

	getAuthorityNutsStats(): Observable<INutsApiResult> {
		return this.http.get(this.actionCountryUrl + 'authority/nuts').map(res => <INutsApiResult>res.json());
	}

	getAuthoritySimilar(id: string): Observable<IAuthoritySimilarApiResult> {
		return this.http.get(this.actionCountryUrl + 'authority/similar/' + id).map(res => <IAuthoritySimilarApiResult>res.json());
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

	autocomplete(entity: string, field: string, search: string): Observable<IApiResult> {
		return this.http.post(this.actionCountryUrl + 'autocomplete', JSON.stringify({entity: entity, field: field, search: search}), {headers: this.headers}).map(res => <IApiResult>res.json());
	}
}


