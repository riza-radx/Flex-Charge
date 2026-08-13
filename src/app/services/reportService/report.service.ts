import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "http://localhost:3000";
    private apiUrl = environment.apiUrl;
  

  constructor(private httpClient: HttpClient) { }

  // Get All Reports
  // getAllReports(filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/reports/allreports`
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
  getAllReports(filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reports/allreports`;
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
  

  // Get Current User Reports
  // getCurrentUserReports() {
  //   const url = `${this.apiUrl}/api/v1/reports/currentuserrebort`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getCurrentUserReports() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reports/currentuserrebort`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Report
  // getReport(reportId: any) {
  //   const url = `${this.apiUrl}/api/v1/reports/singlerebort/${reportId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getReport(reportId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reports/singlerebort/${reportId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // 🆕 Send Report Email — dergon nje raport te ruajtur me email tek marresi perkates
  // (Partner / UserGroup / Company / User / Card owner).
  // FormData duhet te permbaje field `excel` me Excel buffer-in (nga XLSX.write).
  // Backend-i e bashkangjet me nje email dhe update-on tracking (sent_at, send_count).
  sendReportEmail(reportId: any, formData: FormData) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reports/${reportId}/send-email`;
    return this.httpClient.post(url, formData, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        // Mos vendos Content-Type — browser-i vendos automatikisht multipart boundary.
    }).pipe(catchError(this.errorHandler));
  }

  // 🆕 Generate Purchase Invoices ne BC per Partner Report — VETEM COMPANY_ANALYST.
  // Backend krijon draft PI per çdo Location (Purchase Rate + Partner Earnings)
  // dhe update-on reports.pi_generated_at per idempotency.
  generatePartnerPI(reportId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reports/${reportId}/generate-pi`;
    return this.httpClient.post(url, {}, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Report By Company
  // getAllReportByCompany(companyId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/reports/reportbycompany/${companyId}`
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
  getAllReportByCompany(companyId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reports/reportbycompany/${companyId}`;
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

  // Get Report By User Group
  // getAllReportByUserGroup(userGroupId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/reports/reportbyusergroup/${userGroupId}`
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
  getAllReportByUserGroup(userGroupId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reports/reportbyusergroup/${userGroupId}`;
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

  // Get Report By User
  // getAllReportByUser(userId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/reports/reportbyuser/${userId}`
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
  getAllReportByUser(userId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reports/reportbyuser/${userId}`;
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

  // Get Report By Partner
  // getAllReportByPartner(partnerId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/reports/reportbypartner/${partnerId}`
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
  getAllReportByPartner(partnerId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');  // Retrieve the token from localStorage
    const url = `${this.apiUrl}/api/v1/reports/reportbypartner/${partnerId}`;
    
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
        .append('Authorization', `Bearer ${token}`) // Add Authorization header
    })
    .pipe(catchError(this.errorHandler));
  }

  // Get Report By From Date and To Date
  // getAllReportByFromAndToDate(fromDate: any, toDate: any) {
  //   const url = `${this.apiUrl}/api/v1/reports/reportbybyfromandtodate/${fromDate}/${toDate}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getAllReportByFromAndToDate(fromDate: any, toDate: any) {
    const token = localStorage.getItem('authToken');  // Retrieve the token from localStorage
    const url = `${this.apiUrl}/api/v1/reports/reportbybyfromandtodate/${fromDate}/${toDate}`;
  
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('Authorization', `Bearer ${token}`) // Add Authorization header
    })
    .pipe(catchError(this.errorHandler));
  }

  // // Create Report
  // createReport(body: any) {
  //   const url = `${this.apiUrl}/api/v1/reports/createreport`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Update Report
  // updateReport(reportId: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/reports/updatereport/${reportId}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Delete Report
  // deleteReport(reportId: any) {
  //   const url = `${this.apiUrl}/api/v1/reports/deletereport/${reportId}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // Create Report
  createReport(body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reports/createreport`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Update Report
  updateReport(reportId: any, body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reports/updatereport/${reportId}`;
    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Delete Report
  deleteReport(reportId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reports/deletereport/${reportId}`;
    return this.httpClient.delete(url, {
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
