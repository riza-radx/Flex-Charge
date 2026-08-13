import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { BehaviorSubject, catchError, map, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class TaxService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All Taxes
  // getAllTaxes(filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/tax/allTaxs`
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
  getAllTaxes(filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/tax/allTaxs`
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

  // Get Tax
  // getTax(taxId: any) {
  //   const url = `${this.apiUrl}/api/v1/tax/TaxById/${taxId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getTax(taxId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/tax/TaxById/${taxId}`
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Tax By Name
  // getTaxByName(taxName: any) {
  //   const url = `${this.apiUrl}/api/v1/tax/TaxByName/${taxName}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getTaxByName(taxName: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/tax/TaxByName/${taxName}`
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  // Get Tax By Percentage
  // getTaxByPercentage(percentage: any) {
  //   const url = `${this.apiUrl}/api/v1/tax/TaxBypercentage/${percentage}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getTaxByPercentage(percentage: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/tax/TaxBypercentage/${percentage}`
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Tax By User Group
  // getTaxByUserGroup(userGroupId: any) {
  //   const url = `${this.apiUrl}/api/v1/tax/TaxByUserGroup/${userGroupId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getTaxByUserGroup(userGroupId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/tax/TaxByUserGroup/${userGroupId}`
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // // Get Tax By Id Number
  // getTaxByIdNo(idNo: any) {
  //   const url = `${this.apiUrl}/api/v1/tax/TaxByidNo/${idNo}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getTaxByIdNo(idNo: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/tax/TaxByidNo/${idNo}`
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  // Get Tax By User
  // getTaxByUser(userId: any) {
  //   const url = `${this.apiUrl}/api/v1/tax/TaxByuserId/${userId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getTaxByUser(userId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/tax/TaxByuserId/${userId}`
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Tax By Company
  // getTaxByCompany(companyId: any, filters: any = {}) {
  //   let params = new HttpParams();
  //   for (const key in filters) {
  //     if (filters.hasOwnProperty(key) && filters[key]) {
  //       params = params.set(key, filters[key]);
  //     }
  //   }
  //   const url = `${this.apiUrl}/api/v1/tax/TaxByusercompanyId/${companyId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     params: params,
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getTaxByCompany(companyId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    let params = new HttpParams();
    for (const key in filters) {
      if (filters.hasOwnProperty(key) && filters[key]) {
        params = params.set(key, filters[key]);
      }
    }
    const url = `${this.apiUrl}/api/v1/tax/TaxByusercompanyId/${companyId}`
    return this.httpClient.get(url, {
      observe: 'body',
      params: params,
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Tax By Partner
  // getTaxByPartner(partnerId: any) {
  //   const url = `${this.apiUrl}/api/v1/tax/TaxBypartnerId/${partnerId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getTaxByPartner(partnerId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/tax/TaxBypartnerId/${partnerId}`
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Add Tax
  // addTax(body: any) {
  //   const url = `${this.apiUrl}/api/v1/tax/addTax`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  addTax(body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/tax/addTax`
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }

  // Update Tax
  // updateTax(taxId: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/tax/updateTax/${taxId}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  updateTax(taxId: any, body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/tax/updateTax/${taxId}`
    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }

  // Delete Tax
  // deleteTax(taxId: any) {
  //   const url = `${this.apiUrl}/api/v1/tax/deleteTax/${taxId}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  deleteTax(taxId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/tax/deleteTax/${taxId}`
    return this.httpClient.delete(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }

  errorHandler(httpErrorResponse: HttpErrorResponse) {
    return new Observable((observer: Observer<any>) => {
      observer.error(httpErrorResponse);
    })
  }

  // getCurrentMonthCount(): Observable<number> {
  //   const url = `${this.apiUrl}/api/v1/tax/taxes/current-month/count`;
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
    const url = `${this.apiUrl}/api/v1/tax/taxes/current-month/count`;
    return this.httpClient.get<{ success: boolean; count?: number; message?: string }>(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
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
