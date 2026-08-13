import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, map, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class AlarmService {

  // private apiUrl = "https://localhost:3001";
  // private apiUrl = "https://api.radx.app";
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

  getIPInfo() {
    const url = 'https://pro.ip-api.com/json/?key=0lR0QzRGYyY5L08';
    return this.httpClient.get(url, {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    }).pipe(catchError(this.errorHandler));
  }

  // Get All Alarms
  // getAllAlarms(timezone: any) {
  //   const encodedTimezone = encodeURIComponent(timezone);
  //   const url = `${this.apiUrl}/api/v1/alarm/allalarms/${encodedTimezone}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }

  // // Get Alarm
  // getAlarm(alarmId: any) {
  //   const url = `${this.apiUrl}/api/v1/alarm/alarmbyid/${alarmId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  // // Get Alarms By Charger
  // getAlarmByCharger(chargerId: any, timezone: any) {
  //   const encodedTimezone = encodeURIComponent(timezone);
  //   const url = `${this.apiUrl}/api/v1/alarm/alarmbychargerid/${chargerId}/${encodedTimezone}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  // // Get Alarme By Connector
  // getAlarmByConnector(connectorId: any, timezone: any) {
  //   const encodedTimezone = encodeURIComponent(timezone);
  //   const url = `${this.apiUrl}/api/v1/alarm/alarmbyconnectorid/${connectorId}/${encodedTimezone}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  // // Get Alarms By Error Code
  // getAlarmByErrorCode(errorCode: any, timezone: any) {
  //   const encodedTimezone = encodeURIComponent(timezone);
  //   const url = `${this.apiUrl}/api/v1/alarm/alarmbyerrorcode/${errorCode}/${encodedTimezone}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  // // Get Alarms By Status
  // getAlarmByStatus(status: any, timezone: any) {
  //   const encodedTimezone = encodeURIComponent(timezone);
  //   const url = `${this.apiUrl}/api/v1/alarm/alarmbystatus/${status}/${encodedTimezone}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  // // Get Alarms By Alarm Time
  // getAlarmByTime(alarmTime: any, timezone: any) {
  //   const encodedTimezone = encodeURIComponent(timezone);
  //   const url = `${this.apiUrl}/api/v1/alarm/alarmbyalarmtime/${alarmTime}/${encodedTimezone}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }



  // getCurrentMonthAlarmCount(): Observable<number> {
  //   const url = `${this.apiUrl}/api/v1/alarm/alarms/current-month/count`;
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


  // getAlarmsByPartnerId(partnerId: number, timezone: any) {
  //   const encodedTimezone = encodeURIComponent(timezone);
  //   const url = `${this.apiUrl}/api/v1/alarm/alarms/partner/${partnerId}/${encodedTimezone}`;
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  // getAlarmsByCompanyId(companyId: number, timezone: any) {
  //   const encodedTimezone = encodeURIComponent(timezone);
  //   const url = `${this.apiUrl}/api/v1/alarm/alarms/company/${companyId}/${encodedTimezone}`;
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getAllAlarms(timezone: any) {
    const token = localStorage.getItem('authToken');
    const encodedTimezone = encodeURIComponent(timezone);
    const url = `${this.apiUrl}/api/v1/alarm/allalarms/${encodedTimezone}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Alarm
  getAlarm(alarmId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/alarm/alarmbyid/${alarmId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Alarms By Charger
  getAlarmByCharger(chargerId: any, timezone: any) {
    const token = localStorage.getItem('authToken');
    const encodedTimezone = encodeURIComponent(timezone);
    const url = `${this.apiUrl}/api/v1/alarm/alarmbychargerid/${chargerId}/${encodedTimezone}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Alarm By Connector
  getAlarmByConnector(connectorId: any, timezone: any) {
    const token = localStorage.getItem('authToken');
    const encodedTimezone = encodeURIComponent(timezone);
    const url = `${this.apiUrl}/api/v1/alarm/alarmbyconnectorid/${connectorId}/${encodedTimezone}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Alarms By Error Code
  getAlarmByErrorCode(errorCode: any, timezone: any) {
    const token = localStorage.getItem('authToken');
    const encodedTimezone = encodeURIComponent(timezone);
    const url = `${this.apiUrl}/api/v1/alarm/alarmbyerrorcode/${errorCode}/${encodedTimezone}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Alarms By Status
  getAlarmByStatus(status: any, timezone: any) {
    const token = localStorage.getItem('authToken');
    const encodedTimezone = encodeURIComponent(timezone);
    const url = `${this.apiUrl}/api/v1/alarm/alarmbystatus/${status}/${encodedTimezone}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Alarms By Alarm Time
  getAlarmByTime(alarmTime: any, timezone: any) {
    const token = localStorage.getItem('authToken');
    const encodedTimezone = encodeURIComponent(timezone);
    const url = `${this.apiUrl}/api/v1/alarm/alarmbyalarmtime/${alarmTime}/${encodedTimezone}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Current Month Alarm Count
  getCurrentMonthAlarmCount(): Observable<number> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/alarm/alarms/current-month/count`;
    return this.httpClient.get<{ success: boolean; count?: number; message?: string }>(url, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    }).pipe(
      map(response => {
        if (response.success) {
          return response.count || 0;
        } else {
          throw new Error(response.message || 'Failed to retrieve count');
        }
      })
    );
  }

  // Get Alarms By Partner ID
  getAlarmsByPartnerId(partnerId: number, timezone: any) {
    const token = localStorage.getItem('authToken');
    const encodedTimezone = encodeURIComponent(timezone);
    const url = `${this.apiUrl}/api/v1/alarm/alarms/partner/${partnerId}/${encodedTimezone}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Alarms By Company ID
  getAlarmsByCompanyId(companyId: number, timezone: any) {
    const token = localStorage.getItem('authToken');
    const encodedTimezone = encodeURIComponent(timezone);
    const url = `${this.apiUrl}/api/v1/alarm/alarms/company/${companyId}/${encodedTimezone}`;
    return this.httpClient.get(url, {
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
  // getAlarmsByPartnerId(partnerId: number): Observable<any> {
  //   return this.httpClient.get(`${this.apiUrl}/api/v1/alarm/alarms/partner/${partnerId}`);
  // }

  // getAlarmsByCompanyId(companyId: number): Observable<any> {
  //   return this.httpClient.get(`${this.apiUrl}/api/v1/alarm/alarms/company/${companyId}`);
  // }

}
