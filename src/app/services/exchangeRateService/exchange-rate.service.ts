import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

export interface ExchangeRateRow {
  exchange_rate_id: number;
  valute: string;
  exchange_rate: number;
  date: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }

  /** GET /api/v1/exchangeRate?valute&from&to */
  list(filters: { valute?: string; from?: string; to?: string } = {}): Observable<{ success: boolean; count: number; rates: ExchangeRateRow[] }> {
    let params = new HttpParams();
    if (filters.valute) params = params.set('valute', filters.valute);
    if (filters.from) params = params.set('from', filters.from);
    if (filters.to) params = params.set('to', filters.to);
    return this.http.get<any>(`${this.apiUrl}/api/v1/exchangeRate`, {
      params,
      withCredentials: true,
      headers: this.headers()
    });
  }

  /** POST /api/v1/exchangeRate/fetch-now — trigger manual i fetch-it nga BSH (admin only) */
  fetchNow(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/exchangeRate/fetch-now`, {}, {
      withCredentials: true,
      headers: this.headers()
    });
  }

  /** POST /api/v1/exchangeRate/manual — upsert manual (admin only) */
  manualUpsert(valute: string, exchange_rate: number, date: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/exchangeRate/manual`,
      { valute, exchange_rate, date },
      { withCredentials: true, headers: this.headers() }
    );
  }
}
