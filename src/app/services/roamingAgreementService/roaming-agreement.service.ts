import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({ providedIn: 'root' })
export class RoamingAgreementService {
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }

  /** Liste e marreveshjeve te kompanise se logged-in user-it. */
  list(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/api/v1/roamingAgreement`, {
      withCredentials: true,
      headers: this.headers()
    });
  }

  getById(id: number): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/api/v1/roamingAgreement/${id}`, {
      withCredentials: true,
      headers: this.headers()
    });
  }
}
