import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, map, Observable, Observer, throwError } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All Partners
  // getAllPartners() {
  //   const url = `${this.apiUrl}/api/v1/partner/getallpartners`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }
  getAllPartners() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partner/getallpartners`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Partner
  // getPartner(partnerId: any) {
  //   const url = `${this.apiUrl}/api/v1/partner/getsinglepartner/${partnerId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPartner(partnerId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partner/getsinglepartner/${partnerId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Partner For The Report
  // getsinglepartnerForTheReport(partnerId: any) {
  //   const url = `${this.apiUrl}/api/v1/partner/getsinglepartnerForTheReport/${partnerId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getsinglepartnerForTheReport(partnerId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partner/getsinglepartnerForTheReport/${partnerId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  

  // Get Partner By Name
  // getPartnerByName(partnerName: any) {
  //   const url = `${this.apiUrl}/api/v1/partner/getsinglepartnerbyname/${partnerName}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPartnerByName(partnerName: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partner/getsinglepartnerbyname/${partnerName}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Partner By Address
  // getPartnerByAddress(partnerAddress: any) {
  //   const url = `${this.apiUrl}/api/v1/partner/getsinglepartnerbyaddress/${partnerAddress}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPartnerByAddress(partnerAddress: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partner/getsinglepartnerbyaddress/${partnerAddress}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  

  // Get Partner By City
  // getPartnerByCity(partnerCity: any) {
  //   const url = `${this.apiUrl}/api/v1/partner/getsinglepartnerbycity/${partnerCity}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPartnerByCity(partnerCity: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partner/getsinglepartnerbycity/${partnerCity}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Partner By Phone Number
  // getPartnerByPhoneNumber(partnerPhoneNumber: any) {
  //   const url = `${this.apiUrl}/api/v1/partner/getsinglepartnerbyphone/${partnerPhoneNumber}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPartnerByPhoneNumber(partnerPhoneNumber: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partner/getsinglepartnerbyphone/${partnerPhoneNumber}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Partner By Email
  // getPartnerByEmail(partnerEmail: any) {
  //   const url = `${this.apiUrl}/api/v1/partner/getsinglepartnerbyemail/${partnerEmail}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getPartnerByEmail(partnerEmail: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partner/getsinglepartnerbyemail/${partnerEmail}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  
  // Get Partner By NIPT
  // getPartnerByNIPT(partnerNIPT: any) {
  //   const url = `${this.apiUrl}/api/v1/partner/getsinglepartnerbynipt/${partnerNIPT}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPartnerByNIPT(partnerNIPT: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partner/getsinglepartnerbynipt/${partnerNIPT}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Partner By Company
  // getPartnerByCompany(companyId: any) {
  //   const url = `${this.apiUrl}/api/v1/partner/getsinglepartnerbycompany/${companyId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPartnerByCompany(companyId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partner/getsinglepartnerbycompany/${companyId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  

  // Get Partner By User
  // getPartnerByUser(userId: any) {
  //   const url = `${this.apiUrl}/api/v1/partner/getsinglepartnerbyuser/${userId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPartnerByUser(userId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partner/getsinglepartnerbyuser/${userId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // // Add Partner
  // createPartner(body: any) {
  //   const url = `${this.apiUrl}/api/v1/partner/addPartner`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  //   // Partner Service
  // createPartner(formData: FormData) {
  //   const url = `${this.apiUrl}/api/v1/partner/addPartner`;
  //   return this.httpClient.post(url, formData, {
  //     observe: 'body',
  //     withCredentials: true,
  //   });
  // }
  // createPartner(partner: any): Observable<any> {
  //   return this.httpClient.post(`${this.apiUrl}/api/v1/partner/addPartner`, partner);
  // }



  // // Update Partner
  // updatePartner(partnerId: any, partner: any): Observable<any> {
  //   const url = `${this.apiUrl}/api/v1/partner/updatePartner/${partnerId}`
  //   return this.httpClient.put(url, partner)
  // }

  // // Delete Partner
  // deletePartner(partnerId: any) {
  //   const url = `${this.apiUrl}/api/v1/partner/deletePartner/${partnerId}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // Create Partner
  createPartner(partner: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    return this.httpClient.post(`${this.apiUrl}/api/v1/partner/addPartner`, partner, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Update Partner
  updatePartner(partnerId: any, partner: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partner/updatePartner/${partnerId}`;
    return this.httpClient.put(url, partner, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Delete Partner
  deletePartner(partnerId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partner/deletePartner/${partnerId}`;
    return this.httpClient.delete(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }


  errorHandler(httpErrorResponse: HttpErrorResponse) {
    return new Observable((observer: Observer<any>) => {
      observer.error(httpErrorResponse);
    })
  }

  // getCurrentMonthCount(): Observable<number> {
  //   const url = `${this.apiUrl}/api/v1/partner/partners/current-month/count`;
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
    const url = `${this.apiUrl}/api/v1/partner/partners/current-month/count`;
    return this.httpClient.get<{ success: boolean; count?: number; message?: string }>(url).pipe(
      map(response => {
        if (response.success) {
          return response.count || 0;
        } else {
          // You can throw a more detailed error here for better debugging
          throw new Error(response.message || 'Failed to retrieve count');
        }
      }),
      catchError((error) => {
        // Handling HTTP or network errors
        console.error('Error fetching current month count:', error);
        return throwError(() => new Error('An error occurred while fetching the current month count'));
      })
    );
  }
  
}
