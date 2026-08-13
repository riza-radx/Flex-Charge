import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, Observer } from 'rxjs';
import { environment } from '../environment';

export interface AuditLogQuery {
  entity_type?: string;
  entity_id?: string | number;
  action?: string;
  actor_id?: string | number;
  actor_name?: string;
  status?: string;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getAllAuditLogs(query: AuditLogQuery = {}): Observable<any> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/auditLog`;

    let params = new HttpParams();
    Object.keys(query).forEach(key => {
      const v = (query as any)[key];
      if (v !== null && v !== undefined && v !== '') {
        params = params.set(key, String(v));
      }
    });

    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`),
      params
    }).pipe(catchError(this.errorHandler));
  }

  errorHandler(err: HttpErrorResponse) {
    return new Observable((observer: Observer<any>) => observer.error(err));
  }
}
