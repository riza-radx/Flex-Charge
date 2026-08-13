import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, Observer, throwError } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  // Register
  userRegister(body: any) {
    // let httpHeaders = new HttpHeaders({
    //   'content-Type': 'application/json'
    // });
    // return this.httpClient.post(`${this.apiUrl}/register`, 
    //   signupRequestPayload,
    //   {headers: httpHeaders}
    // );
    const companyId = 27;
    return this.httpClient.post(`${this.apiUrl}/api/v1/auth/userregisterFromWhiteLabel/registerfromWhitelabel/${companyId}`, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
  // Register
  // userRegisterFromDashboard(body: any) {
  //   return this.httpClient.post(`${this.apiUrl}/api/v1/auth/userregisterFromDashboard/registerFromDashboard`, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   });
  // }

  userRegisterFromDashboard(body: any) {
    const token = localStorage.getItem('authToken');
  
    return this.httpClient.post(`${this.apiUrl}/api/v1/auth/userregisterFromDashboard/registerFromDashboard`, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }
  // Login
  userLogin(body: any) {
    const companyId = 27;
    return this.httpClient.post<any>(`${this.apiUrl}/api/v1/auth/userloginfrowhitelabel/loginfromwhitelabel/${companyId}`, body, {
      observe: 'body',
      withCredentials: true,
      // responseType: 'json',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    })
  }

  // Forgot Password
  forgotPassword(body: any) {
    return this.httpClient.post<any>(`${this.apiUrl}/api/v1/auth/userforgotpassword/forget-password`, body, {
      observe: 'body',
      withCredentials: true,
      // responseType: 'json',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    })
  }
  // Forgot Password Whitelabel
  forgotPasswordWhitelabel(body: any) {
    const companyId = 27;
    return this.httpClient.post<any>(`${this.apiUrl}/api/v1/auth/userforgotpasswordwhitelabel/forget-passwordwhitelabel/${companyId}`, body, {
      observe: 'body',
      withCredentials: true,
      // responseType: 'json',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    })
  }
  getCurrentUserDetails(): Observable<any> {
    const token = localStorage.getItem('authToken');
    return this.httpClient.get<any>(`${this.apiUrl}/api/v1/auth/currentuserDetails/current`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }

  // Reset Password
  resetPassword(id: any, body: any) {
    return this.httpClient.post<any>(`${this.apiUrl}/api/v1/auth/userresetpassword/reset-password/${id}`, body, {
      observe: 'body',
      withCredentials: true,
      // responseType: 'json',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    })
  }

  // Verify Email
  verifyEmail(email: any, token: any) {
    return this.httpClient.post<any>(`${this.apiUrl}/api/v1/auth/userverifyemail/verifyemail/${email}/${token}`, {
      observe: 'body',
      withCredentials: true,
      // responseType: 'json',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    })
  }

  // Logout
  userLogout() {
    // Remove specific items from localStorage
    localStorage.clear();
    document.cookie = 'authToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refreshToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('userRole');
    localStorage.removeItem('cugpCred');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    return this.httpClient.get(`${this.apiUrl}/api/v1/auth/userlogout/logout`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    })
    // localStorage.removeItem('userInfo');
  }

  // Get Current User
  // getCurrentUser() {
  //   // localStorage.clear();
  //   return this.httpClient.get(`${this.apiUrl}/api/v1/auth/currentuser/current`, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type','application/json')
  //   })
  //   // localStorage.removeItem('userInfo');
  // }
  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('authToken');
    return this.httpClient.get<any>(`${this.apiUrl}/api/v1/auth/currentuser/current`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }
  isTokenExpired(token: string): boolean {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  }

  // getCUGPBasedOnUserRole(): Observable<any> {
  //   const token = localStorage.getItem('authToken');
  //   console.log('Token:', token);
  //   return this.httpClient.get<any>(`${this.apiUrl}/api/v1/auth/cugpbasedonusertole/cugp`, {
  //     headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
  //   });
  // }

  getCUGPBasedOnUserRole(): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found in localStorage');
      return throwError(() => new Error('No token found'));
    }

    if (this.isTokenExpired(token)) {
      console.error('Token is expired');
      return throwError(() => new Error('Token is expired'));
    }

    return this.httpClient.get<any>(`${this.apiUrl}/api/v1/auth/cugpbasedonusertole/cugp`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }


  isAuthenticated(): Boolean {
    let userData = localStorage.getItem('userInfo')
    if (userData && JSON.parse(userData)) {
      return true;
    }
    return false;
  }

  isLoggedIn(): Boolean {
    let userData = localStorage.getItem('userInfo')
    if (userData && JSON.parse(userData)) {
      return true;
    }
    return false;
  }

  userVerifyPhone(userId: any, body: any) {
    return this.httpClient.post<any>(
      `${this.apiUrl}/api/v1/auth/userverifyphone/verifyphone/${userId}`,
      body,
      {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('Content-Type', 'application/json')
      }
    );
  }
  

  errorHandler(httpErrorResponse: HttpErrorResponse) {
    return new Observable((observer: Observer<any>) => {
      observer.error(httpErrorResponse);
    })
  }
}
