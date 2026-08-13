import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

export type BursaSource = 'alpex_api' | 'fallback_avg7' | 'manual_correction' | 'manual_upload';

export interface BursaHourlyPrice {
  id: number;
  trading_date: string;
  hour: number;
  price_eur_mwh: number;
  exchange_rate_eur_all: number;
  buy_price_all_kwh: number;
  source: BursaSource;
  fetched_at: string;
  created_by?: number | null;
  bursa_config_id?: number | null;
}

export interface BursaConfig {
  id: number;
  effective_from: string;
  aet_fee_eur_mwh: number;
  imbalance_fee_eur_mwh: number;
  ost_fee_all_mwh: number;
  ossh_fee_all_mwh: number;
  peak_hours_json: number[];
  ftl_price_offpeak_all_mwh: number;
  ftl_price_peak_all_mwh: number;
  notes?: string | null;
}

export interface BursaMonthDay {
  date: string;
  hours_count: number;
  avg_eur_mwh: number;
  avg_buy_price_all_kwh: number;   // 🆕 mesatarja e cmimit final ne ALL/kWh
  sources: Record<BursaSource, number>;
  dominant_source: BursaSource;
}

export interface BursaCorrectionLog {
  id: number;
  trading_date: string;
  hour: number;
  price_eur_mwh_old: number;
  price_eur_mwh_new: number;
  buy_price_all_kwh_old: number;
  buy_price_all_kwh_new: number;
  source_old: string;
  source_new: string;
  affected_sessions_count: number;
  total_cost_diff_all: number;
  corrected_at: string;
  corrected_by?: number | null;
  notes?: string | null;
}

export interface RefetchPreview {
  hour: number;
  old_price_eur_mwh: number | null;
  new_price_eur_mwh: number;
  old_buy_price_all_kwh: number | null;
  new_buy_price_all_kwh: number;
  old_source: string;
}

@Injectable({ providedIn: 'root' })
export class BursaPriceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }

  /** GET /api/v1/bursaPrices?date=YYYY-MM-DD */
  getByDate(date: string): Observable<{ success: boolean; date: string; count: number; prices: BursaHourlyPrice[] }> {
    const params = new HttpParams().set('date', date);
    return this.http.get<any>(`${this.apiUrl}/api/v1/bursaPrices`, {
      params,
      withCredentials: true,
      headers: this.headers()
    });
  }

  /** GET /api/v1/bursaPrices/month?year&month */
  getMonthSummary(year: number, month: number): Observable<{ success: boolean; year: number; month: number; days: BursaMonthDay[] }> {
    const params = new HttpParams()
      .set('year', String(year))
      .set('month', String(month));
    return this.http.get<any>(`${this.apiUrl}/api/v1/bursaPrices/month`, {
      params,
      withCredentials: true,
      headers: this.headers()
    });
  }

  /** GET /api/v1/bursaPrices/config */
  getConfig(): Observable<{ success: boolean; config: BursaConfig }> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/bursaPrices/config`, {
      withCredentials: true,
      headers: this.headers()
    });
  }

  /** POST /api/v1/bursaPrices/refetch/preview */
  refetchPreview(date: string): Observable<{
    success: boolean;
    date: string;
    changes_count: number;
    affected_sessions: number;
    changes: RefetchPreview[];
  }> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/bursaPrices/refetch/preview`, { date }, {
      withCredentials: true,
      headers: this.headers()
    });
  }

  /** POST /api/v1/bursaPrices/refetch */
  refetch(date: string, recompute: boolean = true): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/bursaPrices/refetch`, { date, recompute }, {
      withCredentials: true,
      headers: this.headers()
    });
  }

  /** POST /api/v1/bursaPrices/manual — body: { date, prices: [{hour, price_eur_mwh}...], recompute? } */
  manualUpload(date: string, prices: Array<{ hour: number; price_eur_mwh: number }>, recompute: boolean = true): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/bursaPrices/manual`, { date, prices, recompute }, {
      withCredentials: true,
      headers: this.headers()
    });
  }

  /** GET /api/v1/bursaPrices/corrections?date | ?from&to */
  getCorrections(filters: { date?: string; from?: string; to?: string } = {}): Observable<{ success: boolean; count: number; corrections: BursaCorrectionLog[] }> {
    let params = new HttpParams();
    if (filters.date) params = params.set('date', filters.date);
    if (filters.from) params = params.set('from', filters.from);
    if (filters.to) params = params.set('to', filters.to);
    return this.http.get<any>(`${this.apiUrl}/api/v1/bursaPrices/corrections`, {
      params,
      withCredentials: true,
      headers: this.headers()
    });
  }
}
