import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, Observer } from "rxjs";
import { environment } from './environment';


@Injectable({
  providedIn: 'root'
})
export class PartnerMemberService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "http://localhost:3000";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All Partner Members
  // getAllPartnerMembers() {
  //   const url = `${this.apiUrl}/api/v1/partnerMember/allpartnermembers`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }

  getAllPartnerMembers() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partnerMember/allpartnermembers`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    }).pipe(catchError(this.errorHandler));
  }
  
  // Get Partner Member
  // getPartnerMember(id: any) {
  //   const url = `${this.apiUrl}/api/v1/partnerMember/usergrmemberbyid/${id}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPartnerMember(id: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partnerMember/usergrmemberbyid/${id}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    }).pipe(catchError(this.errorHandler));
  }
  

  // Get Partner Member By Partner
  // getPartnerMemberByPartner(PartnerId: any) {
  //   const url = `${this.apiUrl}/api/v1/partnerMember/partnermemberbygroupid/${PartnerId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getPartnerMemberByPartner(PartnerId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partnerMember/partnermemberbygroupid/${PartnerId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    }).pipe(catchError(this.errorHandler));
  }
  // Get Partner Member By User
  // getPartnerMemberByUser(userId: any) {
  //   const url = `${this.apiUrl}/api/v1/partnerMember/partnermemberbyuserid/${userId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getPartnerMemberByUser(userId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partnerMember/partnermemberbyuserid/${userId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    }).pipe(catchError(this.errorHandler));
  }

  // Get Partner Member By Type
  // getPartnerMemberByType(type: any) {
  //   const url = `${this.apiUrl}/api/v1/partnerMember/partnermemberbytype/${type}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getPartnerMemberByType(type: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partnerMember/partnermemberbytype/${type}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    }).pipe(catchError(this.errorHandler));
  }
  // // Add Partner Member
  // addPartnerMember(body: any) {
  //   const url = `${this.apiUrl}/api/v1/partnerMember/addpartnermember`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Update Partner Member
  // updatePartnerMember(id: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/partnerMember/updatepartnermember/${id}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Delete Partner Member
  // deletePartnerMember(id: any) {
  //   const url = `${this.apiUrl}/api/v1/partnerMember/deletepartnermember/${id}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // Add Partner Member
  addPartnerMember(body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partnerMember/addpartnermember`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Update Partner Member
  updatePartnerMember(id: any, body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partnerMember/updatepartnermember/${id}`;
    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Delete Partner Member
  deletePartnerMember(id: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/partnerMember/deletepartnermember/${id}`;
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
