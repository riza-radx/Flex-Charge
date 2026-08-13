import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, map, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class PromoService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "http://localhost:3000";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All Promos
  // getAllPromos() {
  //   const url = `${this.apiUrl}/api/v1/promo/allpromos`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }
  getAllPromos() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/promo/allpromos`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Promo
  // getPromo(promoId: any) {
  //   const url = `${this.apiUrl}/api/v1/promo/promoById/${promoId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPromo(promoId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/promo/promoById/${promoId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Promo By Name
  // getPromoByName(promoName: any) {
  //   const url = `${this.apiUrl}/api/v1/promo/promoByName/${promoName}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getPromoByName(promoName: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/promo/promoByName/${promoName}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  // Get Promo By Percentage
  // getPromoByPercentage(percentage: any) {
  //   const url = `${this.apiUrl}/api/v1/promo/promoByCode/${percentage}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPromoByPercentage(percentage: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/promo/promoByCode/${percentage}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Promo By Company
  // getPromoByCompany(companyId: any) {
  //   const url = `${this.apiUrl}/api/v1/promo/promoByCompany/${companyId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getPromoByCompany(companyId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/promo/promoByCompany/${companyId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  // Get Promo By Is Enabled
  // getPromoByIsEnabled(isEnabled: any) {
  //   const url = `${this.apiUrl}/api/v1/promo/promoByisEnabled/${isEnabled}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPromoByIsEnabled(isEnabled: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/promo/promoByisEnabled/${isEnabled}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // // Add Promo
  // addPromo(body: any) {
  //   const url = `${this.apiUrl}/api/v1/promo/addPromo`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Update Promo
  // updatePromo(promoId: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/promo/updatePromo/${promoId}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Delete Promo
  // deletePromo(promoId: any) {
  //   const url = `${this.apiUrl}/api/v1/promo/deletePromo/${promoId}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // Add Promo
  addPromo(body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/promo/addPromo`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Update Promo
  updatePromo(promoId: any, body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/promo/updatePromo/${promoId}`;
    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Delete Promo
  deletePromo(promoId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/promo/deletePromo/${promoId}`;
    return this.httpClient.delete(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders()
      .append('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }


  /** 🔹 Merr të gjitha promo notifications */
  getAllPromoNotifications(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/api/v1/promoNotification/allPromoNotifications`, {
      headers: this.getAuthHeaders(),
      withCredentials: true,
      observe: 'body'
    });
  }

  /** 🔹 Merr një promo notification sipas ID-së */
  getPromoNotificationById(notificationId: number): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/api/v1/promoNotification/promoNotificationsById/${notificationId}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true,
      observe: 'body'
    });
  }

  /** 🔹 Merr promo notifications sipas promo ID */
  getPromoNotificationsByPromoId(promoId: any): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/api/v1/promoNotification/promoNotificationsbyPromo/${promoId}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true,
      observe: 'body'
    });
  }

  /** 🔹 Krijo një promo notification të re */
  createPromoNotification(body: any): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/api/v1/promoNotification/createPromoNotifications`, body, {
      headers: this.getAuthHeaders(),
      withCredentials: true,
      observe: 'body'
    });
  }

  /** 🔹 Përditëso një promo notification ekzistuese */
  updatePromoNotification(notificationId: number, body: any): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/api/v1/promoNotification/updatePromoNotifications/${notificationId}`, body, {
      headers: this.getAuthHeaders(),
      withCredentials: true,
      observe: 'body'
    });
  }

  /** 🔹 Fshij një promo notification (në fakt e bën inactive) */
  deletePromoNotification(notificationId: number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/api/v1/promoNotification/deletePromoNotifications/${notificationId}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true,
      observe: 'body'
    });
  }

  getUserOffersByPromoId(promoId: any): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/api/v1/userOfferHistory/userOfferByPromo/${promoId}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true,
      observe: 'body'
    });
  }

  errorHandler(httpErrorResponse: HttpErrorResponse) {
    return new Observable((observer: Observer<any>) => {
      observer.error(httpErrorResponse);
    })
  }

  // getCurrentMonthCount(): Observable<number> {
  //   const url = `${this.apiUrl}/api/v1/promo/promos/current-month/count`;
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
    const url = `${this.apiUrl}/api/v1/promo/promos/current-month/count`;

    return this.httpClient.get<{ success: boolean; count?: number; message?: string }>(url, {
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
