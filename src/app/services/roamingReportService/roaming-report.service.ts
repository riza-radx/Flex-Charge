import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({ providedIn: 'root' })
export class RoamingReportService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }

  /**
   * Per COMPANY_*: backend force-on home_company_id tek kompania e user-it.
   * homeCompanyId mund te jete null — eshte i panevojshem ne VegaCharging.
   */
  companyAgreementReport(homeCompanyId: number | null, from: string, to: string): Observable<any> {
    let params = new HttpParams().set('from', from).set('to', to);
    if (homeCompanyId) params = params.set('home_company_id', String(homeCompanyId));
    return this.http.get(`${this.apiUrl}/api/v1/roamingReport/company-agreement`, {
      params,
      withCredentials: true,
      headers: this.headers()
    });
  }
}
