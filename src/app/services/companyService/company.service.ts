import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, map, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";

  private apiUrl = environment.apiUrl;
  
  constructor(private httpClient: HttpClient) { }

  // Get All Companies
  // getAllCompanies() {
  //   const url = `${this.apiUrl}/api/v1/company/getallcompanies`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }
  getAllCompanies() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/company/getallcompanies`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Company
  // getCompany(companyId: any) {
  //   const url = `${this.apiUrl}/api/v1/company/getcompany/${companyId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getCompany(companyId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/company/getcompany/${companyId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Company For The Report
  // getCompanyForTheReport(companyId: any) {
  //   const url = `${this.apiUrl}/api/v1/company/getcompanyForTheReport/${companyId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getCompanyForTheReport(companyId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/company/getcompanyForTheReport/${companyId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Company By Name
  // getCompanyByName(name: any) {
  //   const url = `${this.apiUrl}/api/v1/company/companybyname/${name}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getCompanyByName(name: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/company/companybyname/${name}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Company By Address
  // getCompanyByAddress(address: any) {
  //   const url = `${this.apiUrl}/api/v1/company/companybyaddress/${address}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getCompanyByAddress(address: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/company/companybyaddress/${address}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // // Get Company By City
  // getCompanyByCity(city: any) {
  //   const url = `${this.apiUrl}/api/v1/company/companybycity/${city}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getCompanyByCity(city: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/company/companybycity/${city}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Company By Country
  // getCompanyByCountry(country: any) {
  //   const url = `${this.apiUrl}/api/v1/company/companybycountry/${country}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getCompanyByCountry(country: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/company/companybycountry/${country}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // // Get Company By Phone
  // getCompanyByPhone(phone: any) {
  //   const url = `${this.apiUrl}/api/v1/company/companybyphone/${phone}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getCompanyByPhone(phone: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/company/companybyphone/${phone}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Company By Email
  // getCompanyByEmail(email: any) {
  //   const url = `${this.apiUrl}/api/v1/company/companybyemail/${email}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getCompanyByEmail(email: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/company/companybyemail/${email}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // // Create Company
  // addCompany(body: any): Observable<any> {
  //   const url = `${this.apiUrl}/api/v1/company/createcompany`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     // headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Update Company
  // updateCompany(companyId: any, body: any): Observable<any> {
  //   const url = `${this.apiUrl}/api/v1/company/updatecompany/${companyId}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     // headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Delete Company
  // deleteCompany(companyId: any) {
  //   const url = `${this.apiUrl}/api/v1/company/deletecompany/${companyId}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  // Create Company
  addCompany(body: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/company/createcompany`;

    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Update Company
  updateCompany(companyId: any, body: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/company/updatecompany/${companyId}`;

    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Delete Company
  deleteCompany(companyId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/company/deletecompany/${companyId}`;

    return this.httpClient.delete(url, {
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

  // getCurrentMonthCount(): Observable<number> {
  //   const url = `${this.apiUrl}/api/v1/company/companies/current-month/count`;
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
    const url = `${this.apiUrl}/api/v1/company/companies/current-month/count`;
    return this.httpClient.get<{ success: boolean; count?: number; message?: string }>(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('Authorization', `Bearer ${token}`) 
    }).pipe(
      map(response => {
        if (response.success) {
          return response.count || 0;
        } else {
          throw new Error(response.message || 'Failed to retrieve count');
        }
      }),
      catchError(this.errorHandler)
    );
  }
  
}
