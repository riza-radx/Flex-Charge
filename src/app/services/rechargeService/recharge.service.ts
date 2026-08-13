import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class RechargeService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "http://localhost:3000";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All Recharges
  // getAllRecharges() {
  //   const url = `${this.apiUrl}/api/v1/recharge/allrecharges`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }
  getAllRecharges() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/recharge/allrecharges`;

    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Recharge
  // getRecharge(id: any) {
  //   const url = `${this.apiUrl}/api/v1/recharge/singlerecharge/${id}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getRecharge(id: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/recharge/singlerecharge/${id}`;

    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // // Get Recharge By Card
  // getRechargeByCard(cardId: any) {
  //   const url = `${this.apiUrl}/api/v1/recharge/cardrecharge/${cardId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getRechargeByCard(cardId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/recharge/cardrecharge/${cardId}`;

    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get recharges by User ID
  // getRechargesByUserId(userId: any, filters: any = {}): Observable<any> {
  //   const queryParams = new HttpParams({ fromObject: filters }); // Convert filters to query parameters
  //   const url = `${this.apiUrl}/api/v1/recharge/userrecharge/${userId}`;

  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json'),
  //     params: queryParams // Pass filters as query parameters
  //   }).pipe(catchError(this.errorHandler));
  // }
  getRechargesByUserId(userId: any, filters: any = {}): Observable<any> {
    const token = localStorage.getItem('authToken');
    const queryParams = new HttpParams({ fromObject: filters });
    const url = `${this.apiUrl}/api/v1/recharge/userrecharge/${userId}`;

    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`),
      params: queryParams
    }).pipe(catchError(this.errorHandler));
  }

  // Get recharges by User Group ID
  // getRechargesByUserGroup(userGroupId: any, filters: any = {}): Observable<any> {
  //   const queryParams = new HttpParams({ fromObject: filters }); // Convert filters to query parameters
  //   const url = `${this.apiUrl}/api/v1/recharge/userGrouprecharge/${userGroupId}`;

  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json'),
  //     params: queryParams // Pass filters as query parameters
  //   }).pipe(catchError(this.errorHandler));
  // }
  getRechargesByUserGroup(userGroupId: any, filters: any = {}): Observable<any> {
    const token = localStorage.getItem('authToken');
    const queryParams = new HttpParams({ fromObject: filters });
    const url = `${this.apiUrl}/api/v1/recharge/userGrouprecharge/${userGroupId}`;

    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`),
      params: queryParams
    }).pipe(catchError(this.errorHandler));
  }

  // Get recharges by Company ID
  // getRechargesByCompany(companyId: any, filters: any = {}): Observable<any> {
  //   const queryParams = new HttpParams({ fromObject: filters }); // Convert filters to query parameters
  //   const url = `${this.apiUrl}/api/v1/recharge/companyrecharge/${companyId}`;

  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json'),
  //     params: queryParams // Pass filters as query parameters
  //   }).pipe(catchError(this.errorHandler));
  // }
  getRechargesByCompany(companyId: any, filters: any = {}): Observable<any> {
    const token = localStorage.getItem('authToken');
    const queryParams = new HttpParams({ fromObject: filters });
    const url = `${this.apiUrl}/api/v1/recharge/companyrecharge/${companyId}`;

    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`),
      params: queryParams
    }).pipe(catchError(this.errorHandler));
  }


  // Get Recharge By Source
  // getRechargeBySource(source: any) {
  //   const url = `${this.apiUrl}/api/v1/recharge/sourcerecharge/${source}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getRechargeBySource(source: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/recharge/sourcerecharge/${source}`;

    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // // Create Recharge
  // addRecharge(body: any): Observable<any> {
  //   const url = `${this.apiUrl}/api/v1/recharge/addrechargewhitelabel`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // addRechargeForUser(userId: any, body: any): Observable<any> {
  //   const url = `${this.apiUrl}/api/v1/recharge/addrechargeforUserwhitelabel/${userId}`;
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   });
  // }

  // // Method for adding recharge for a user group
  // addRechargeForUserGroup(userGroupId: any, body: any): Observable<any> {
  //   const url = `${this.apiUrl}/api/v1/recharge/addrechargeForUserGroupwhitelabel/${userGroupId}`;
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   });
  // }

  // addRechargeForUserAdmin(userId: any, body: any): Observable<any> {
  //   const url = `${this.apiUrl}/api/v1/recharge/addrechargeforUserwhitelabeladmin/${userId}`;
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   });
  // }

  // // Method for adding recharge for a user group
  // addRechargeForUserGroupAdmin(userGroupId: any, body: any): Observable<any> {
  //   const url = `${this.apiUrl}/api/v1/recharge/addrechargeForUserGroupwhitelabeladmin/${userGroupId}`;
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   });
  // }

  // // Update Recharge
  // updateRecharge(id: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/recharge/updaterecharge/${id}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Delete Recharge
  // deleteRecharge(id: any) {
  //   const url = `${this.apiUrl}/api/v1/recharge/deleterecharge/${id}`
  //   return this.httpClient.put(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // Create Recharge
  addRecharge(body: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/recharge/addrechargewhitelabel`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Add Recharge For User
  addRechargeForUser(userId: any, body: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/recharge/addrechargeforUserwhitelabel/${userId}`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Add Recharge For User Group
  addRechargeForUserGroup(userGroupId: any, body: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/recharge/addrechargeForUserGroupwhitelabel/${userGroupId}`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Add Recharge For User Admin
  addRechargeForUserAdmin(userId: any, body: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/recharge/addrechargeforUserwhitelabeladmin/${userId}`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Add Recharge For User Group Admin
  addRechargeForUserGroupAdmin(userGroupId: any, body: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/recharge/addrechargeForUserGroupwhitelabeladmin/${userGroupId}`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  transferMoney(body: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/recharge/transfer-money`;

    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }
  // Update Recharge
  updateRecharge(id: any, body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/recharge/updaterecharge/${id}`;
    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Delete Recharge
  deleteRecharge(id: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/recharge/deleterecharge/${id}`;
    return this.httpClient.put(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }


  errorHandler(httpErrorResponse: HttpErrorResponse) {
    return new Observable((observer: Observer<any>) => {
      observer.error(httpErrorResponse);
    })
  }
}
