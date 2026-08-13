import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, Observer } from "rxjs";
import { map } from 'rxjs/operators';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;
  private ipInfo: any = null;

  constructor(private httpClient: HttpClient) { }

  private fetchIpInfo(): Observable<any> {
    if (this.ipInfo) {
      // Return cached IP info if available
      return new Observable((observer) => {
        observer.next(this.ipInfo);
        observer.complete();
      });
    }
  
    // Fetch IP info from API if not cached
    const url = 'https://pro.ip-api.com/json/?key=0lR0QzRGYyY5L08';
    return this.httpClient.get(url).pipe(
      map((response) => {
        this.ipInfo = response; // Cache the IP info
        // console.log('Fetched IP Info:', response); // Ensure it's logged when fetched
        return response;
      }),
      catchError(this.errorHandler)
    );
  }
  
getIPInfo(): Observable<any> {
  return this.fetchIpInfo(); // Use fetchIpInfo() to handle IP fetching and caching
}

  // Get All Logs
  // getAllLogs(timezone: any) {
  //   const encodedTimezone = encodeURIComponent(timezone);
  //   const url = `${this.apiUrl}/api/v1/log/getalllogs/${encodedTimezone}`
  //   this.fetchIpInfo()
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }
  getAllLogs(timezone: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const encodedTimezone = encodeURIComponent(timezone);
    const url = `${this.apiUrl}/api/v1/log/getalllogs/${encodedTimezone}`;
    this.fetchIpInfo();
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }
  // Get IPInfo


  // Get Log
  // getLog(id: any, timezone: any) {
  //   const encodedTimezone = encodeURIComponent(timezone); // Encode the timezone
  // const url = `${this.apiUrl}/api/v1/log/getlog/${id}/${encodedTimezone}`;
  //   // const url = `${this.apiUrl}/api/v1/log/getlog/${id}/${timezone}`
  //   this.fetchIpInfo()
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getLog(id: any, timezone: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const encodedTimezone = encodeURIComponent(timezone); // Encode the timezone
    const url = `${this.apiUrl}/api/v1/log/getlog/${id}/${encodedTimezone}`;
    this.fetchIpInfo();
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Get Logs By Charger
  // getLogByCharger(chargerId: any, timezone: any) {
  //   const encodedTimezone = encodeURIComponent(timezone);
  //   const url = `${this.apiUrl}/api/v1/log/logbycharger/${chargerId}/${encodedTimezone}`
  //   this.fetchIpInfo()
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getLogByCharger(chargerId: any, timezone: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const encodedTimezone = encodeURIComponent(timezone);
    const url = `${this.apiUrl}/api/v1/log/logbycharger/${chargerId}/${encodedTimezone}`;
    this.fetchIpInfo();
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Get Logs By Connector
  // getLogByConnector(connectorId: any, timezone: any) {
  //   const encodedTimezone = encodeURIComponent(timezone);
  //   const url = `${this.apiUrl}/api/v1/log/logbyconnector/${connectorId}/${encodedTimezone}`
  //   this.fetchIpInfo()
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getLogByConnector(connectorId: any, timezone: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const encodedTimezone = encodeURIComponent(timezone);
    const url = `${this.apiUrl}/api/v1/log/logbyconnector/${connectorId}/${encodedTimezone}`;
    this.fetchIpInfo();
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Get Logs By Date
  // getLogByDate(date: any, timezone: any) {
  //   const encodedTimezone = encodeURIComponent(timezone);
  //   const url = `${this.apiUrl}/api/v1/log/logbydate/${date}/${encodedTimezone}`
  //   this.fetchIpInfo()
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getLogByDate(date: any, timezone: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const encodedTimezone = encodeURIComponent(timezone);
    const url = `${this.apiUrl}/api/v1/log/logbydate/${date}/${encodedTimezone}`;
    this.fetchIpInfo();
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Create Log
  // addLog(body: any) {
  //   const url = `${this.apiUrl}/api/v1/log/createlog`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  addLog(body: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/log/createlog`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  errorHandler(httpErrorResponse: HttpErrorResponse) {
    return new Observable((observer: Observer<any>) => {
      observer.error(httpErrorResponse);
    })
  }
}
