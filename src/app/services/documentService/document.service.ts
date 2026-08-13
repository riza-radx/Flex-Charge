import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All Documents
  // getAllDocuments(filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/documents/alldocuments`
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
  getAllDocuments(filters: any = {}) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/documents/alldocuments`;

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
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Get Document
  // getDocument(documentId: any) {
  //   const url = `${this.apiUrl}/api/v1/documents/singledocument/${documentId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getDocument(documentId: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/documents/singledocument/${documentId}`;

    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Get Document By Company
  // getDocumentByCompany(companyId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/documents/documentbycompany/${companyId}`
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
  getDocumentByCompany(companyId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/documents/documentbycompany/${companyId}`;

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
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Get Document By Partner
  // getDocumentByPartner(partnerId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/documents/documentbypartner/${partnerId}`
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
  getDocumentByPartner(partnerId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/documents/documentbypartner/${partnerId}`;

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
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Get Document By User Group
  // getDocumentByUserGroup(userGroupId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/documents/documentbyusergroup/${userGroupId}`
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
  getDocumentByUserGroup(userGroupId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/documents/documentbyusergroup/${userGroupId}`;

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
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Get Document By User
  // getDocumentByUser(userId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/documents/documentbyuser/${userId}`
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
  getDocumentByUser(userId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/documents/documentbyuser/${userId}`;

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
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // // Add Document
  // addDocumentx(formData: FormData) {
  //   formData.forEach((value, key) => {
  //     console.log(`${key}: ${value}`);
  //   });
  //   const url = `${this.apiUrl}/api/v1/documents/createdocument`;
  //   return this.httpClient.post(url, formData, {
  //     observe: 'body',
  //     withCredentials: true,
  //   });
  // }

  // // Update Document
  // updateDocument(documentId: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/documents/updatedocument/${documentId}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Delete Document
  // deleteDocument(documentId: any) {
  //   const url = `${this.apiUrl}/api/v1/documents/deletedocument/${documentId}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // Add Document
  addDocumentx(formData: FormData): Observable<{ success: boolean; message: string }> {
    formData.forEach((value, key) => console.log(`${key}: ${value}`));

    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/documents/createdocument`;

    return this.httpClient.post<{ success: boolean; message: string }>(url, formData, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`) // Ensure token is included for security
    }).pipe(catchError(this.errorHandler));
  }

  // Update Document
  updateDocument(documentId: any, body: any): Observable<{ success: boolean; message: string }> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/documents/updatedocument/${documentId}`;

    return this.httpClient.put<{ success: boolean; message: string }>(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Delete Document
  deleteDocument(documentId: any): Observable<{ success: boolean; message: string }> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/documents/deletedocument/${documentId}`;

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
