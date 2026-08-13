import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { BehaviorSubject, catchError, map, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All Vouchers
  // getAllVouchers(filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/voucher/allvouchers`
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
  getAllVouchers(filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/voucher/allvouchers`;
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
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Voucher
  // getVoucher(voucherId: any) {
  //   const url = `${this.apiUrl}/api/v1/voucher/voucherById/${voucherId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getVoucher(voucherId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/voucher/voucherById/${voucherId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Voucher By Name
  // getVoucherByName(voucherName: any) {
  //   const url = `${this.apiUrl}/api/v1/voucher/voucherByName/${voucherName}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getVoucherByName(voucherName: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/voucher/voucherByName/${voucherName}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }


  // Get Voucher By Amount
  // getVoucherByAmount(amount: any) {
  //   const url = `${this.apiUrl}/api/v1/voucher/voucherByAmount/${amount}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getVoucherByAmount(amount: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/voucher/voucherByAmount/${amount}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // // Get Voucher By Company
  // getVoucherCompany(companyId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/voucher/voucherByCompany/${companyId}`
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
  getVoucherCompany(companyId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/voucher/voucherByCompany/${companyId}`;
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
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Voucher By Current User
  // getVoucherByCurrentUser(filters: any = {}) {
  //   const token = localStorage.getItem('authToken');
  //   const url = `${this.apiUrl}/api/v1/voucher/voucherByCurrentUser`
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
  //     // headers: new HttpHeaders().append('Content-Type', 'application/json')
  //     headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getVoucherByCurrentUser(filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/voucher/voucherByCurrentUser`;
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
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Voucher By Expired Date
  // getVoucherByExpiredDate(expDate: any) {
  //   const url = `${this.apiUrl}/api/v1/voucher/voucherByexpDate/${expDate}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getVoucherByExpiredDate(expDate: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/voucher/voucherByexpDate/${expDate}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // // Add Voucher
  // addVoucher(body: any) {
  //   const url = `${this.apiUrl}/api/v1/voucher/addVoucher`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Update Voucher
  // updateVoucher(voucherId: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/voucher/updateVoucher/${voucherId}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Delete Voucher
  // deleteVoucher(voucherId: any) {
  //   const url = `${this.apiUrl}/api/v1/voucher/deleteVoucher/${voucherId}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // Add Voucher
  addVoucher(body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/voucher/addVoucher`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Update Voucher
  updateVoucher(voucherId: any, body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/voucher/updateVoucher/${voucherId}`;
    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Delete Voucher
  deleteVoucher(voucherId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/voucher/deleteVoucher/${voucherId}`;
    return this.httpClient.delete(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }


  // Use Voucher
  useVoucher(body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/voucher/useVoucher`
    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      // headers: new HttpHeaders().append('Content-Type', 'application/json')
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    })
  }
  userDettailUseVoucher(userId: string, body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/voucher/useVoucher/${userId}`;
    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
    });
  }

  userGroupUseVoucher(usergrId: string, body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/voucher/useVoucherForUserGroup/${usergrId}`;
    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
    });
  }

  errorHandler(httpErrorResponse: HttpErrorResponse) {
    return new Observable((observer: Observer<any>) => {
      observer.error(httpErrorResponse);
    })
  }

  // getCurrentMonthCount(): Observable<number> {
  //   const url = `${this.apiUrl}/api/v1/voucher/voucher/current-month/count`;
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
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/voucher/voucher/current-month/count`;
    return this.httpClient.get<{ success: boolean; count?: number; message?: string }>(url, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
      withCredentials: true
    }).pipe(
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
