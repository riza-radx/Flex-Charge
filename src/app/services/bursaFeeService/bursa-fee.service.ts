import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

export interface BursaFee {
  id: number;
  code: string;
  name: string;
  currency: 'EUR' | 'ALL';
  value_per_mwh: number;
  effective_from: string;
  effective_to?: string | null;
  is_active: boolean;
  sort_order: number;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BursaFeeSummary {
  fees: BursaFee[];
  eur_total: number;
  all_total: number;
  count: number;
}

@Injectable({ providedIn: 'root' })
export class BursaFeeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }

  /** GET /api/v1/bursaFee — te gjitha (perfshin te fikura). */
  list(): Observable<{ success: boolean; count: number; fees: BursaFee[] }> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/bursaFee`, {
      withCredentials: true, headers: this.headers()
    });
  }

  /** GET /api/v1/bursaFee/active?date=YYYY-MM-DD — vetem aktive. */
  listActive(date?: string): Observable<{ success: boolean; date: string } & BursaFeeSummary> {
    let params = new HttpParams();
    if (date) params = params.set('date', date);
    return this.http.get<any>(`${this.apiUrl}/api/v1/bursaFee/active`, {
      params, withCredentials: true, headers: this.headers()
    });
  }

  /** POST /api/v1/bursaFee */
  create(fee: Partial<BursaFee>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/bursaFee`, fee, {
      withCredentials: true, headers: this.headers()
    });
  }

  /** PUT /api/v1/bursaFee/:id */
  update(id: number, updates: Partial<BursaFee>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/v1/bursaFee/${id}`, updates, {
      withCredentials: true, headers: this.headers()
    });
  }

  /** DELETE /api/v1/bursaFee/:id — soft delete (is_active=false + effective_to=today). */
  deactivate(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/v1/bursaFee/${id}`, {
      withCredentials: true, headers: this.headers()
    });
  }
}
