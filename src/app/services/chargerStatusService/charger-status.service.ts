import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ChargerStatusService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All Charger Statuses
  // getAllChargerStatuses() {
  //   const url = `${this.apiUrl}/api/v1/chargerStatus/allchargerstatus`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }

  // // Get Charger Status
  // getChargerStatus(chargerStatusId: any) {
  //   const url = `${this.apiUrl}/api/v1/chargerStatus/chargerstatusById/${chargerStatusId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  // // Get Charger Status By Charger
  // getChargerStatusByCharger(chargerId: any) {
  //   const url = `${this.apiUrl}/api/v1/chargerStatus/allchargerstatusbychargerid/${chargerId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  // // Get Charger Status By Real Time Status
  // getChargerStatusByRealTimeStatus(realTimeStatus: any) {
  //   const url = `${this.apiUrl}/api/v1/chargerStatus/allchargerstatusbyrealtimestatus/${realTimeStatus}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  // // Get Charger Status By Rated Power
  // getChargerStatusByRatedPower(ratedPower: any) {
  //   const url = `${this.apiUrl}/api/v1/chargerStatus/allchargerstatusbyratedpower/${ratedPower}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  // // Get Charger Status By Online Time
  // getChargerStatusByOnlineTime(onlineTime: any) {
  //   const url = `${this.apiUrl}/api/v1/chargerStatus/allchargerstatusbyonlinetime/${onlineTime}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  // // Get Charger Status By Current Power
  // getChargerStatusByCurrentPower(currentPower: any) {
  //   const url = `${this.apiUrl}/api/v1/chargerStatus/allchargerstatusbycurrentpower/${currentPower}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getAllChargerStatuses() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargerStatus/allchargerstatus`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charger Status
  getChargerStatus(chargerStatusId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargerStatus/chargerstatusById/${chargerStatusId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Charger Status By Charger
  getChargerStatusByCharger(chargerId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargerStatus/allchargerstatusbychargerid/${chargerId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Charger Status By Real Time Status
  getChargerStatusByRealTimeStatus(realTimeStatus: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargerStatus/allchargerstatusbyrealtimestatus/${realTimeStatus}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Charger Status By Rated Power
  getChargerStatusByRatedPower(ratedPower: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargerStatus/allchargerstatusbyratedpower/${ratedPower}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Charger Status By Online Time
  getChargerStatusByOnlineTime(onlineTime: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargerStatus/allchargerstatusbyonlinetime/${onlineTime}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Charger Status By Current Power
  getChargerStatusByCurrentPower(currentPower: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargerStatus/allchargerstatusbycurrentpower/${currentPower}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(httpErrorResponse: HttpErrorResponse) {
    return new Observable((observer: Observer<any>) => {
      observer.error(httpErrorResponse);
    })
  }
}
