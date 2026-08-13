import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All Payment Methods
  // getAllPaymentMethod() {
  //   const url = `${this.apiUrl}/api/v1/paymentMethod/allpaymentmethod`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }
  getAllPaymentMethod() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/paymentMethod/allpaymentmethod`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  

  // Get Payment Method
  // getPaymentMethod(paymentMethodId: any) {
  //   const url = `${this.apiUrl}/api/v1/paymentMethod/paymentmethod/${paymentMethodId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPaymentMethod(paymentMethodId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/paymentMethod/paymentmethod/${paymentMethodId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Payment Method By User
  // getPaymentMethodByUser(userId: any) {
  //   const url = `${this.apiUrl}/api/v1/paymentMethod/paymentmethodbyuser/${userId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPaymentMethodByUser(userId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/paymentMethod/paymentmethodbyuser/${userId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Payment Method By Current User
  // getPaymentMethodByCurrentUser() {
  //   const token = localStorage.getItem('authToken');
  //   const url = `${this.apiUrl}/api/v1/paymentMethod/paymentmethodbycurrentuser`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     // headers: new HttpHeaders().append('Content-Type', 'application/json')
  //     headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPaymentMethodByCurrentUser() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/paymentMethod/paymentmethodbycurrentuser`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Add Stripe Payment Method
  // addStripePaymentMethod(body: any) {
  //   const token = localStorage.getItem('authToken');
  //   const url = `${this.apiUrl}/api/v1/paymentMethod/addStripePaymentMethod`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     // headers: new HttpHeaders().append('Content-Type', 'application/json')
  //     headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  addStripePaymentMethod(body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/paymentMethod/addStripePaymentMethod`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

    // Add POK Payment Method
    // addPokPaymentMethod(body: any) {
    //   const token = localStorage.getItem('authToken');
    //   const url = `${this.apiUrl}/api/v1/paymentMethod/addPokPaymentMethodwhitelabel`
    //   return this.httpClient.post(url, body, {
    //     observe: 'body',
    //     withCredentials: true,
    //     // headers: new HttpHeaders().append('Content-Type', 'application/json')
    //     headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    //   })
    //     .pipe(catchError(this.errorHandler));
    // }
    addPokPaymentMethod(body: any) {
      const token = localStorage.getItem('authToken');
      const url = `${this.apiUrl}/api/v1/paymentMethod/addPokPaymentMethodwhitelabel`;
      return this.httpClient.post(url, body, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
      }).pipe(catchError(this.errorHandler));
    }

  // Get Payment Method By UserGroup
  // getPaymentMethodByUserGroup(userGroupId: any) {
  //   const url = `${this.apiUrl}/api/v1/paymentMethod/paymentmethodbyusergroup/${userGroupId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPaymentMethodByUserGroup(userGroupId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/paymentMethod/paymentmethodbyusergroup/${userGroupId}`;
    return this.httpClient.get(url, {
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
}
