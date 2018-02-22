import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {ConfigService} from './config.service';
import {
	IApiResultGeoJSON, IApiResultAuthority, IApiResultAuthoritySimilar, IApiResultCompany, IApiResultCompanySimilar,
	IApiResultDownloadTenderSearch, IApiResultNuts,
	IApiResultPortalsStats, IApiResultRegion, IApiResultSearchAuthority, IApiResultSearchCompany, IApiResultSearchTender,
	IGetByIdCommand, IApiResultSector, IApiResultSectors, IApiResultStat, IApiResultStatStats, IApiResultTender,
	ISearchCommand, IApiResultAutoComplete, IApiResultPing, IDownload, IDownloadOCDS
} from '../app.interfaces';

@Injectable()
export class ApiService {

	private absUrl = '';
	private actionUrl = '';
	private actionCountryUrl = '';
	private headers: HttpHeaders;

	constructor(private http: HttpClient, private config: ConfigService) {
		this.absUrl = config.absUrl;
		this.actionUrl = (config.config.backendUrl || '') + '/api/';
		this.actionCountryUrl = this.actionUrl + (config.country.id || 'all') + '/';
		this.headers = new HttpHeaders();
		this.headers.append('Content-Type', 'application/json');
		this.headers.append('Accept', 'application/json');
	}

	post<T>(url: string, params: Object): Observable<T> {
		if (this.config.locale) {
			params['lang'] = this.config.locale;
		}
		return this.http.post<T>(this.actionCountryUrl + url, params, {headers: this.headers});
	}

	getIndicatorScoreStats(params: ISearchCommand): Observable<IApiResultStat> {
		return this.post<IApiResultStat>('indicators/score-stats', params);
	}

	getIndicatorRangeStats(params: ISearchCommand): Observable<IApiResultStat> {
		return this.post<IApiResultStat>('indicators/range-stats', params);
	}

	getSectorStats(params: IGetByIdCommand): Observable<IApiResultSector> {
		return this.post<IApiResultSector>('sector/stats', params);
	}

	getRegionStats(params: IGetByIdCommand): Observable<IApiResultRegion> {
		return this.post<IApiResultRegion>('region/stats', params);
	}

	getCompanyStats(params: IGetByIdCommand): Observable<IApiResultStatStats> {
		return this.post<IApiResultStatStats>('company/stats', params);
	}

	getAuthorityStats(params: IGetByIdCommand): Observable<IApiResultStatStats> {
		return this.post<IApiResultStatStats>('authority/stats', params);
	}

	getMarketAnalysisStats(params: ISearchCommand): Observable<IApiResultStat> {
		return this.post<IApiResultStat>('market/stats', params);
	}

	getHomeStats(): Observable<IApiResultStat> {
		return this.post<IApiResultStat>('home/stats', {});
	}

	searchAuthority(params: ISearchCommand): Observable<IApiResultSearchAuthority> {
		return this.post<IApiResultSearchAuthority>('authority/search', params);
	}

	searchCompany(params: ISearchCommand): Observable<IApiResultSearchCompany> {
		return this.post <IApiResultSearchCompany>('company/search', params);
	}

	searchTender(params: ISearchCommand): Observable<IApiResultSearchTender> {
		return this.post<IApiResultSearchTender>('tender/search', params);
	}

	startDownload(params: IApiResultDownloadTenderSearch): void {
		window.location.href = this.actionCountryUrl + 'download/id/' + params.data.id;
	}

	requestDownload(format: string, params: ISearchCommand): Observable<IApiResultDownloadTenderSearch> {
		return this.post<IApiResultDownloadTenderSearch>('tender/download/' + format, params);
	}

	autocomplete(entity: string, field: string, search: string): Observable<IApiResultAutoComplete> {
		return this.post<IApiResultAutoComplete>('autocomplete', {entity, field, search});
	}

	get<T>(url: string) {
		let query = '';
		if (this.config.locale) {
			query = '?lang=' + this.config.locale;
		}
		return this.http.get<T>(this.actionCountryUrl + url + query);
	}

	getSectors(): Observable<IApiResultSectors> {
		return this.get<IApiResultSectors>('sector/list/main');
	}

	getTender(id: string): Observable<IApiResultTender> {
		return this.get<IApiResultTender>('tender/id/' + id);
	}

	getTenderStats(params: IGetByIdCommand): Observable<IApiResultStatStats> {
		return this.post<IApiResultStatStats>('tender/stats', params);
	}

	getCompany(id: string): Observable<IApiResultCompany> {
		return this.get<IApiResultCompany>('company/id/' + id);
	}

	getSector(id: string): Observable<IApiResultSector> {
		return this.get<IApiResultSector>('sector/id/' + id);
	}

	getCompanyNutsStats(): Observable<IApiResultNuts> {
		return this.get<IApiResultNuts>('company/nuts');
	}

	getCompanySimilar(id: string): Observable<IApiResultCompanySimilar> {
		return this.get<IApiResultCompanySimilar>('company/similar/' + id);
	}

	getAuthority(id: string): Observable<IApiResultAuthority> {
		return this.get<IApiResultAuthority>('authority/id/' + id);
	}

	getAuthorityNutsStats(): Observable<IApiResultNuts> {
		return this.get<IApiResultNuts>('authority/nuts');
	}

	getAuthoritySimilar(id: string): Observable<IApiResultAuthoritySimilar> {
		return this.get<IApiResultAuthoritySimilar>('authority/similar/' + id);
	}

	// country unspecific api gets from backend

	getPortalsStats(): Observable<IApiResultPortalsStats> {
		return this.http.get<IApiResultPortalsStats>(this.actionUrl + 'portals/stats' + (this.config.locale ? '?lang=' + this.config.locale : ''));
	}

	getPortalMapData(): Observable<IApiResultGeoJSON> {
		return this.http.get<IApiResultGeoJSON>(this.actionUrl + 'portals/geo.json');
	}

	// country unspecific gets from frontend

	ping(): Observable<IApiResultPing> {
		return this.http.get<IApiResultPing>(this.absUrl + '/ping' + (this.config.locale ? '?lang=' + this.config.locale : ''));
	}

	getDownloads(): Observable<Array<IDownload>> {
		return this.http.get<Array<IDownload>>(this.absUrl + '/data/files/downloads.json');
	}

	getOCDSDownloads(): Observable<Array<IDownloadOCDS>> {
		return this.http.get<Array<IDownloadOCDS>>(this.absUrl + '/data/files/downloads_ocds.json');
	}

	getNutsMap(level: number): Observable<IApiResultGeoJSON> {
		return this.http.get<IApiResultGeoJSON>(this.absUrl + '/data/nuts/nuts_20M_lvl' + level + '.geo.json');
	}


}


