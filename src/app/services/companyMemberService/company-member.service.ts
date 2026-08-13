import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyMemberService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "http://localhost:3000";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All Company Members
  // getAllCompanyMembers() {
  //   const url = `${this.apiUrl}/api/v1/companyMember/getcompanymembers`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getAllCompanyMembers() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/companyMember/getcompanymembers`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Company Member
  // getCompanyMember(id: any) {
  //   const url = `${this.apiUrl}/api/v1/companyMember/getcompanymember/${id}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getCompanyMember(id: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/companyMember/getcompanymember/${id}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  // Get Company Members By Company
  // getCompanyMemberByCompany(companyId: any) {
  //   const url = `${this.apiUrl}/api/v1/companyMember/memberbycompany/${companyId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getCompanyMemberByCompany(companyId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/companyMember/memberbycompany/${companyId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Company Member By User
  // getCompanyMemberByUser(userId: any) {
  //   const url = `${this.apiUrl}/api/v1/companyMember/memberbyuser/${userId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getCompanyMemberByUser(userId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/companyMember/memberbyuser/${userId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Company Member By Type
  // getCompanyMemberByType(type: any) {
  //   const url = `${this.apiUrl}/api/v1/companyMember/memberbytype/${type}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }


  getCompanyMemberByType(type: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/companyMember/memberbytype/${type}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  // // Add Company Member
  // addCompanyMember(body: any) {
  //   const url = `${this.apiUrl}/api/v1/companyMember/addcompanymember`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Update Company Member
  // updateCompanyMember(id: any, body: any): Observable<{ success: boolean; message: string }> {
  //   const url = `${this.apiUrl}/api/v1/companyMember/updatecompanymember/${id}`;
  //   return this.httpClient.put<{ success: boolean; message: string }>(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   });
  // }

  // // Delete Company Member
  // deleteCompanyMember(id: any) {
  //   const url = `${this.apiUrl}/api/v1/companyMember/deletecompanymember/${id}`
  //   return this.httpClient.put(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // Add Company Member
  addCompanyMember(body: any): Observable<{ success: boolean; message: string }> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/companyMember/addcompanymember`;

    return this.httpClient.post<{ success: boolean; message: string }>(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Update Company Member
  updateCompanyMember(id: any, body: any): Observable<{ success: boolean; message: string }> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/companyMember/updatecompanymember/${id}`;

    return this.httpClient.put<{ success: boolean; message: string }>(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Delete Company Member
  deleteCompanyMember(id: any): Observable<{ success: boolean; message: string }> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/companyMember/deletecompanymember/${id}`;

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
}
