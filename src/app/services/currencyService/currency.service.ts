import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { BehaviorSubject, catchError, map, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All Currencies
  // getAllCurrencies(filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/currency/allCurrencys`
  //   let params = new HttpParams();
  //   for (const key in filters) {
  //     if (filters.hasOwnProperty(key) && filters[key]) {
  //       params = params.set(key, filters[key]);
  //     }
  //   }
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     params: params,
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }
  getAllCurrencies(filters: any = {}) {
    const token = localStorage.getItem('authToken'); 
    const url = `${this.apiUrl}/api/v1/currency/allCurrencys`;
    let params = new HttpParams();
    for (const key in filters) {
      if (filters.hasOwnProperty(key) && filters[key]) {
        params = params.set(key, filters[key]);
      }
    }
    return this.httpClient.get(url, {
      observe: 'body',
      params: params,
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  

  // Get Currency
  // getCurrency(currencyId: any) {
  //   const url = `${this.apiUrl}/api/v1/currency/CurrencyById/${currencyId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getCurrency(currencyId: any) {
    const token = localStorage.getItem('authToken'); 
    const url = `${this.apiUrl}/api/v1/currency/CurrencyById/${currencyId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Currency By Name
  // getCurrencyByName(currencyName: any) {
  //   const url = `${this.apiUrl}/api/v1/currency/CurrencyByName/${currencyName}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getCurrencyByName(currencyName: any) {
    const token = localStorage.getItem('authToken'); 
    const url = `${this.apiUrl}/api/v1/currency/CurrencyByName/${currencyName}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Currency By Company
  // getCurrencyByCompany(companyId: any) {
  //   const url = `${this.apiUrl}/api/v1/currency/CurrencyByCompany/${companyId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getCurrencyByCompany(companyId: any) {
    const token = localStorage.getItem('authToken'); 
    const url = `${this.apiUrl}/api/v1/currency/CurrencyByCompany/${companyId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // // Add Currency
  // addCurrency(body: any) {
  //   const url = `${this.apiUrl}/api/v1/currency/addCurrency`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Update Currency
  // updateCurrency(currencyId: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/currency/updateCurrency/${currencyId}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Delete Currency
  // deleteCurrency(currencyId: any) {
  //   const url = `${this.apiUrl}/api/v1/currency/deleteCurrency/${currencyId}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // Add Currency
  addCurrency(body: any): Observable<{ success: boolean; message: string }> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/currency/addCurrency`;

    return this.httpClient.post<{ success: boolean; message: string }>(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Update Currency
  updateCurrency(currencyId: any, body: any): Observable<{ success: boolean; message: string }> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/currency/updateCurrency/${currencyId}`;

    return this.httpClient.put<{ success: boolean; message: string }>(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Delete Currency
  deleteCurrency(currencyId: any): Observable<{ success: boolean; message: string }> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/currency/deleteCurrency/${currencyId}`;

    return this.httpClient.delete<{ success: boolean; message: string }>(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }


  errorHandler(httpErrorResponse: HttpErrorResponse) {
    return new Observable((observer: Observer<any>) => {
      observer.error(httpErrorResponse);
    })
  }

  // getCurrentMonthCount(): Observable<number> {
  //   const url = `${this.apiUrl}/api/v1/currency/currencies/current-month/count`;
  //   return this.httpClient.get<{ success: boolean; count?: number; message?: string }>(url).pipe(
  //     map(response => {
  //       if (response.success) {
  //         return response.count || 0;
  //       } else {
  //         throw new Error(response.message || 'Failed to retrieve count');
  //       }
  //     })
  //   );
  // }
  getCurrentMonthCount(): Observable<number> {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/currency/currencies/current-month/count`;
    
    return this.httpClient.get<{ success: boolean; count?: number; message?: string }>(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add the Authorization header
    }).pipe(
      map(response => {
        if (response.success) {
          return response.count || 0;
        } else {
          throw new Error(response.message || 'Failed to retrieve count');
        }
      }),
      catchError(this.errorHandler) // Ensure error handling is in place
    );
  }
  
}
