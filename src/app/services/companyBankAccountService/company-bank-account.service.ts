import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

export interface CompanyBankAccount {
  id?: number;
  company_id?: number;
  bank_name: string;
  account_holder?: string | null;
  iban: string;
  swift?: string | null;
  currency: string;
  is_primary: boolean;
  display_order: number;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class CompanyBankAccountService {
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }

  /** Liste te gjitha llogarive (perfshire inactive) per nje kompani. */
  listByCompany(companyId: number | string): Observable<any> {
    const url = `${this.apiUrl}/api/v1/companyBankAccount/byCompany/${companyId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: this.headers()
    });
  }

  create(body: CompanyBankAccount & { companyId: number | string }): Observable<any> {
    const url = `${this.apiUrl}/api/v1/companyBankAccount/create`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: this.headers()
    });
  }

  update(id: number, body: Partial<CompanyBankAccount>): Observable<any> {
    const url = `${this.apiUrl}/api/v1/companyBankAccount/update/${id}`;
    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: this.headers()
    });
  }

  /** Soft delete (active=false). */
  delete(id: number): Observable<any> {
    const url = `${this.apiUrl}/api/v1/companyBankAccount/delete/${id}`;
    return this.httpClient.delete(url, {
      observe: 'body',
      withCredentials: true,
      headers: this.headers()
    });
  }
}
