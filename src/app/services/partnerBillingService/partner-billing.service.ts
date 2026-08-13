import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class PartnerBillingService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // get All Partner Billings
  // getAllPartnerBillings() {
  //   const url = `${this.apiUrl}/api/v1/partnerBilling/getallpartnerbilling`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }
  getAllPartnerBillings() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partnerBilling/getallpartnerbilling`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Partner Billing
  // getPartnerBilling(partnerBillingId: any) {
  //   const url = `${this.apiUrl}/api/v1/partnerBilling/getpartnerbillingbybillingid/${partnerBillingId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPartnerBilling(partnerBillingId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partnerBilling/getpartnerbillingbybillingid/${partnerBillingId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Partner Billing By Company
  // getPartnerBillingByCompany(companyId: any) {
  //   const url = `${this.apiUrl}/api/v1/partnerBilling/getpartnerbillingbycompanyid/${companyId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getPartnerBillingByCompany(companyId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partnerBilling/getpartnerbillingbycompanyid/${companyId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  // Get Partner Billing By Partner
  // getPartnerBillingByPartner(partnerId: any) {
  //   const url = `${this.apiUrl}/api/v1/partnerBilling/getpartnerbillingbypartner/${partnerId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPartnerBillingByPartner(partnerId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partnerBilling/getpartnerbillingbypartner/${partnerId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Partner Billing By Monthly Platform Fee
  // getPartnerBillingByMontlyPlatformFee(monthlyPlatformFee: any) {
  //   const url = `${this.apiUrl}/api/v1/partnerBilling/getpartnerbillingbymonthlyplatformfee/${monthlyPlatformFee}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPartnerBillingByMontlyPlatformFee(monthlyPlatformFee: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partnerBilling/getpartnerbillingbymonthlyplatformfee/${monthlyPlatformFee}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Partner Billing By Enable Coorporate Billing
  // getPartnerBillingByEnableCoorporateBilling(enableCoorporateBilling: any) {
  //   const url = `${this.apiUrl}/api/v1/partnerBilling/partnerBillingbyenablecoorporate/${enableCoorporateBilling}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPartnerBillingByEnableCoorporateBilling(enableCoorporateBilling: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partnerBilling/partnerBillingbyenablecoorporate/${enableCoorporateBilling}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Partner Billing By Corporate Billing Monthly Limit
  // getPartnerBillingByCoorporateBillingMonthlyLimit(coorporateBillingMonthlyLimit: any) {
  //   const url = `${this.apiUrl}/api/v1/partnerBilling/partnerBillingbycoorporatebillingmonthlylimit/${coorporateBillingMonthlyLimit}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPartnerBillingByCoorporateBillingMonthlyLimit(coorporateBillingMonthlyLimit: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partnerBilling/partnerBillingbycoorporatebillingmonthlylimit/${coorporateBillingMonthlyLimit}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Partner Billing By Corporate Billing Discount
  // getPartnerBillingByCoorporateBillingDiscount(coorporateDiscount: any) {
  //   const url = `${this.apiUrl}/api/v1/partnerBilling/partnerBillingbyenablecoorporatebillingdiscount/${coorporateDiscount}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPartnerBillingByCoorporateBillingDiscount(coorporateDiscount: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partnerBilling/partnerBillingbyenablecoorporatebillingdiscount/${coorporateDiscount}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Add Partner Billing
  // createPartnerBilling(body: any) {
  //   const url = `${this.apiUrl}/api/v1/partnerBilling/addPartnerBilling`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  createPartnerBilling(body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partnerBilling/addPartnerBilling`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }

  // Update Partner Billing
  // updatePartnerBilling(partnerBillingId: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/partnerBilling/updatePartnerBiling/${partnerBillingId}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  updatePartnerBilling(partnerBillingId: any, body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partnerBilling/updatePartnerBiling/${partnerBillingId}`;
    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }

  // Delete Partner Billing
  // deletePartnerBilling(partnerBillingId: any) {
  //   const url = `${this.apiUrl}/api/v1/partnerBilling/deletePartnerBiling/${partnerBillingId}`
  //   return this.httpClient.put(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  deletePartnerBilling(partnerBillingId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partnerBilling/deletePartnerBiling/${partnerBillingId}`;
    return this.httpClient.put(url, {
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
}
