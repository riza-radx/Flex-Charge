import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { BehaviorSubject, catchError, map, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  // private apiUrl = "http://localhost:3001";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Current User
  // showCurrentUser(token: any) {
  //   const url = `${this.apiUrl}/api/v1/user/showcurrentuser/showMe/${token}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  showCurrentUser(token: any) {
    const url = `${this.apiUrl}/api/v1/user/showcurrentuser/showMe/${token}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }
  // Get All Users
  // getAllUsers(filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/user/getallusers/getAllUsers`;

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
  //   }).pipe(catchError(this.errorHandler));
  // }
  getAllUsers(filters: any = {}) {
    const url = `${this.apiUrl}/api/v1/user/getallusers/getAllUsers`;
    const token = localStorage.getItem('authToken');

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
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }


  getUsersAndRegisterDevices(companyId: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/user/usercompany/getUsersAndRegisterDevices/${companyId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  getPartnerUsersAndRegisterDevices(partnerId: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/user/usercompany/getPartnerUsersAndRegisterDevices/${partnerId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  getUserGroupUsersAndRegisterDevices(usergrId: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/user/usercompany/getUserGRoupUsersAndRegisterDevices/${usergrId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Get User By Id
  // getUserById(token: any) {
  //   const url = `${this.apiUrl}/api/v1/user/userbyid/getUserById/${token}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getUserById(id: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/user/userbyid/getUserById/${id}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get User By Id For The Report
  // getUserByIdForTheReport(token: any) {
  //   const url = `${this.apiUrl}/api/v1/user/userbyid/getUserByIdForTheReport/${token}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getUserByIdForTheReport(id: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/user/userbyid/getUserByIdForTheReport/${id}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }
  // Get User By Company
  // getUserByCompany(companyID: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/user/usercompany/getUserBycompany/${companyID}`;

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
  //   .pipe(catchError(this.errorHandler));
  // }
  getUserByCompany(companyID: any, filters: any = {}) {
    const url = `${this.apiUrl}/api/v1/user/usercompany/getUserBycompany/${companyID}`;
    const token = localStorage.getItem('authToken');

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
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }


  // Update Current User
  // updateUser(id: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/user/updatecurrentuser/updateUser/${id}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  updateUser(id: any, body: any) {
    const url = `${this.apiUrl}/api/v1/user/updatecurrentuser/updateUser/${id}`;
    const token = localStorage.getItem('authToken');

    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }
  updateUserImage(formData: FormData): Observable<any> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/user/updatecurrentuserImage/updateUserImage`
    return this.httpClient.put(url, formData, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    })
  }
  // updateUserImage(formData: FormData): Observable<any> {
  //   const token = localStorage.getItem('authToken');
  //   const url = `${this.apiUrl}/api/v1/user/updatecurrentuserImage/updateUserImage`;
  //   return this.httpClient.put(url, formData, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders()
  //       .set('Authorization', `Bearer ${token}`)
  //   });
  // }
  // Add payment method
  // addPaymentMethod(body: any) {
  //   const url = `${this.apiUrl}/api/v1/user/add-payment-method`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  addPaymentMethod(body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/user/add-payment-method`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }
  // // Add payment Intent
  // addPaymentIntent(body: any) {
  //   const url = `${this.apiUrl}/api/v1/user/add-payment-payment`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  addPaymentIntent(body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/user/add-payment-payment`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }

  // Update Current User Password
  updateUserPassword(body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/user/updateuserpassword/updatePassword`
    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    })
  }
  // updateUserPassword(body: any) {
  //   const token = localStorage.getItem('authToken');
  //   const url = `${this.apiUrl}/api/v1/user/updateuserpassword/updatePassword`;

  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders()
  //       .set('Authorization', `Bearer ${token}`)
  //       .append('Content-Type', 'application/json')
  //   });
  // }

  // Delete User
  // deleteUser(id: any) {
  //   const url = `${this.apiUrl}/api/v1/user/deleteauser/deleteUser/${id}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  deleteUser(id: any) {
    const url = `${this.apiUrl}/api/v1/user/deleteauser/deleteUser/${id}`;
    const token = localStorage.getItem('authToken');

    return this.httpClient.delete(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .append('Content-Type', 'application/json')
    });
  }

  errorHandler(httpErrorResponse: HttpErrorResponse) {
    return new Observable((observer: Observer<any>) => {
      observer.error(httpErrorResponse);
    })
  }

  // getCurrentMonthCount(): Observable<number> {
  //   const url = `${this.apiUrl}/api/v1/user/users/current-month/count`;
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
    const url = `${this.apiUrl}/api/v1/user/users/current-month/count`;
    const token = localStorage.getItem('authToken');

    return this.httpClient.get<{ success: boolean; count?: number; message?: string }>(url, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
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
