import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { BehaviorSubject, catchError, map, Observable, Observer } from "rxjs";

import * as crypto from 'crypto-js';
import { environment } from '../environment';


@Injectable({
  providedIn: 'root'
})
export class CardService {


  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private publicKey = environment.publicKey;
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Generate HMAC-SHA512 signature
  private generateSignature(payload: any): { signature: string; publicKey: string } {
    if (!this.publicKey) {
      throw new Error('Missing authentication keys');
    }

    const payloadString = JSON.stringify(payload);
    const signature = crypto.HmacSHA512(payloadString, this.publicKey).toString(crypto.enc.Base64);

    return { signature, publicKey: this.publicKey };
  }

  // Construct HTTP Headers with Signature
  //   private getHeaders(payload: any): HttpHeaders {
  //     const { signature, publicKey } = this.generateSignature(payload);
  //     const token = localStorage.getItem('authToken');
  // const { signature, publicKey } = this.generateSignature(filters);

  //     return new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`,
  //       'X-Public-Key': publicKey,
  //       'X-Signature': signature
  //     });
  //   }

  // Get All Cards
  // getAllCards(filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/card/all`
  //   // Convert filters object to HttpParams
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
  getAllCards(filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const { signature, publicKey } = this.generateSignature(filters);
    const url = `${this.apiUrl}/api/v1/card/all`;
    // const headers = this.getHeaders(filters);
    // const { signature, publicKey } = this.generateSignature(filters);
    // Convert filters object to HttpParams
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
        .set('X-Public-Key', `Bearer ${publicKey}`)
        .set('X-Signature', `Bearer ${signature}`),

    }).pipe(catchError(this.errorHandler));


  }

  // Get Card
  // getCard(id: any) {
  //   const url = `${this.apiUrl}/api/v1/card/single/${id}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getCard(id: any) {
    const token = localStorage.getItem('authToken');
    const { signature, publicKey } = this.generateSignature(id);
    const url = `${this.apiUrl}/api/v1/card/single/${id}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Public-Key', `Bearer ${publicKey}`)
        .set('X-Signature', `Bearer ${signature}`),
    }).pipe(catchError(this.errorHandler));
  }

  // Get Card By Serial Number
  // getCardBySerialNumber(serialNumber: any) {
  //   const url = `${this.apiUrl}/api/v1/card/serial/${serialNumber}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getCardBySerialNumber(serialNumber: any) {
    const token = localStorage.getItem('authToken');
    const { signature, publicKey } = this.generateSignature(serialNumber);
    const url = `${this.apiUrl}/api/v1/card/serial/${serialNumber}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Public-Key', `Bearer ${publicKey}`)
        .set('X-Signature', `Bearer ${signature}`),
    }).pipe(catchError(this.errorHandler));
  }

  // Get Card By Block Number
  // getCardByBlockNumber(blockNumber: any) {
  //   const url = `${this.apiUrl}/api/v1/card/block/${blockNumber}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getCardByBlockNumber(blockNumber: any) {
    const token = localStorage.getItem('authToken');
    const { signature, publicKey } = this.generateSignature(blockNumber);
    const url = `${this.apiUrl}/api/v1/card/block/${blockNumber}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Public-Key', `Bearer ${publicKey}`)
        .set('X-Signature', `Bearer ${signature}`),
    }).pipe(catchError(this.errorHandler));
  }

  // Get Card By Status
  // getCardByStatus(status: any) {
  //   const url = `${this.apiUrl}/api/v1/card/status/${status}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getCardByStatus(status: any) {
    const token = localStorage.getItem('authToken');
    const { signature, publicKey } = this.generateSignature(status);
    const url = `${this.apiUrl}/api/v1/card/status/${status}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Public-Key', `Bearer ${publicKey}`)
        .set('X-Signature', `Bearer ${signature}`),
    }).pipe(catchError(this.errorHandler));
  }

  // Get Card By User
  // getCardUser(userId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/card/user/${userId}`
  //   // Convert filters object to HttpParams
  //   let params = new HttpParams();
  //   for (const key in filters) {
  //     if (filters.hasOwnProperty(key) && filters[key]) {
  //       params = params.set(key, filters[key]);
  //     }
  //   }
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getCardUser(userId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const { signature, publicKey } = this.generateSignature(filters);
    const url = `${this.apiUrl}/api/v1/card/user/${userId}`;
    // Convert filters object to HttpParams
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
        .set('X-Public-Key', `Bearer ${publicKey}`)
        .set('X-Signature', `Bearer ${signature}`),
    }).pipe(catchError(this.errorHandler));
  }



  // Get Cards By Company
  // getCardByCompany(companyId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/card/company/${companyId}`
  //   // Convert filters object to HttpParams
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
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getCardByCompany(companyId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const { signature, publicKey } = this.generateSignature(filters);
    const url = `${this.apiUrl}/api/v1/card/company/${companyId}`;
    // Convert filters object to HttpParams
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
        .set('X-Public-Key', `Bearer ${publicKey}`)
        .set('X-Signature', `Bearer ${signature}`),
    }).pipe(catchError(this.errorHandler));
  }

  // 🆕 Get cards issued by a specific distributor (partner). Perdoret nga
  // Partner Detail page → tab "Distributor Cards".
  getCardByDistributor(partnerId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const { signature, publicKey } = this.generateSignature(filters);
    const url = `${this.apiUrl}/api/v1/card/distributor/${partnerId}`;
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
        .set('X-Public-Key', `Bearer ${publicKey}`)
        .set('X-Signature', `Bearer ${signature}`),
    }).pipe(catchError(this.errorHandler));
  }



  // Get Cards By User Group
  // getCardByUserGroup(userGroupId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/card/usergroup/${userGroupId}`
  //   // Convert filters object to HttpParams
  //   let params = new HttpParams();
  //   for (const key in filters) {
  //     if (filters.hasOwnProperty(key) && filters[key]) {
  //       params = params.set(key, filters[key]);
  //     }
  //   }
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getCardByUserGroup(userGroupId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const { signature, publicKey } = this.generateSignature(filters);
    const url = `${this.apiUrl}/api/v1/card/usergroup/${userGroupId}`;
    // Convert filters object to HttpParams
    let params = new HttpParams();
    for (const key in filters) {
      if (filters.hasOwnProperty(key) && filters[key]) {
        params = params.set(key, filters[key]);
      }
    }
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Public-Key', `Bearer ${publicKey}`)
        .set('X-Signature', `Bearer ${signature}`),
    }).pipe(catchError(this.errorHandler));
  }

  // Add Card
  // addCard(body: any): Observable<{ success: boolean; message: string }> {
  //   const url = `${this.apiUrl}/api/v1/card/create`;

  //   return this.httpClient.post<{ success: boolean; message: string }>(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json'),
  //   });
  // }

  // // Update Card
  // updateCard(cardId: any, body: any): Observable<{ success: boolean; message: string }> {
  //   const url = `${this.apiUrl}/api/v1/card/update/${cardId}`;

  //   return this.httpClient.put<{ success: boolean; message: string }>(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json'),
  //   });
  // }

  // // Delete Card
  // deleteCard(cardId: any) {
  //   const url = `${this.apiUrl}/api/v1/card/delete/${cardId}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  addCard(body: any): Observable<{ success: boolean; message: string }> {
    const token = localStorage.getItem('authToken');
    const { signature, publicKey } = this.generateSignature(body);
    const url = `${this.apiUrl}/api/v1/card/create`;

    return this.httpClient.post<{ success: boolean; message: string }>(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Public-Key', `Bearer ${publicKey}`)
        .set('X-Signature', `Bearer ${signature}`),
    }).pipe(catchError(this.errorHandler));
  }

  // Update Card
  updateCard(cardId: any, body: any): Observable<{ success: boolean; message: string }> {
    const token = localStorage.getItem('authToken');
    const { signature, publicKey } = this.generateSignature(body);
    const url = `${this.apiUrl}/api/v1/card/update/${cardId}`;

    return this.httpClient.put<{ success: boolean; message: string }>(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Public-Key', `Bearer ${publicKey}`)
        .set('X-Signature', `Bearer ${signature}`),
    }).pipe(catchError(this.errorHandler));
  }

  // Delete Card
  deleteCard(cardId: any) {
    const token = localStorage.getItem('authToken');
    const { signature, publicKey } = this.generateSignature(cardId);
    const url = `${this.apiUrl}/api/v1/card/delete/${cardId}`;

    return this.httpClient.delete(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Public-Key', `Bearer ${publicKey}`)
        .set('X-Signature', `Bearer ${signature}`),
    }).pipe(catchError(this.errorHandler));
  }

  errorHandler(httpErrorResponse: HttpErrorResponse) {
    return new Observable((observer: Observer<any>) => {
      observer.error(httpErrorResponse);
    })
  }
  getCurrentMonthCount(): Observable<number> {
    const url = `${this.apiUrl}/api/v1/card/cards/current-month/count`;
    return this.httpClient.get<{ success: boolean; count?: number; message?: string }>(url).pipe(
      map(response => {
        if (response.success) {
          return response.count || 0;
        } else {
          throw new Error(response.message || 'Failed to retrieve count');
        }
      })
    );
  }
}
