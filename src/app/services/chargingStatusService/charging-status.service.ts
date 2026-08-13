import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, Observer } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ChargingStatusService {
  // private apiUrl = 'https://api.radx.app/api/v1/charging'
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  // getUserNameByChargingId(chargingId: any): Observable<string> {
  //   return this.http.get(`${this.apiUrl}/getuserbycharging/${chargingId}`, { responseType: 'text' });
  // }

  // getCardSerialByChargingId(chargingId: any): Observable<string> {
  //   return this.http.get(`${this.apiUrl}/getCardSerialByCharging/${chargingId}`, { responseType: 'text' });
  // }

  // getAllChargings(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/allcharging`);
  // }

  // getUserNamesForAllChargings(chargings: any[]): Observable<string[]> {
  //   const userRequests = chargings.map(charging => this.getUserNameByChargingId(charging.charging_id));
  //   return forkJoin(userRequests);
  // }

  // getAllChargingTimes(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/allchargingtimes`);
  // }

  // getAllChargingDetails(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/allchargingdetails`);
  // }
  getUserNameByChargingId(chargingId: any): Observable<string> {
    const token = localStorage.getItem('authToken');
    return this.http.get(`${this.apiUrl}/api/v1/charging/getuserbycharging/${chargingId}`, {
      responseType: 'text',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }
  
  getCardSerialByChargingId(chargingId: any): Observable<string> {
    const token = localStorage.getItem('authToken');
    return this.http.get(`${this.apiUrl}/api/v1/charging/getCardSerialByCharging/${chargingId}`, {
      responseType: 'text',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }
  
  getAllChargings(): Observable<any> {
    const token = localStorage.getItem('authToken');
    return this.http.get(`${this.apiUrl}/api/v1/charging/allcharging`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }
  
  getUserNamesForAllChargings(chargings: any[]): Observable<string[]> {
    const token = localStorage.getItem('authToken');
    const userRequests = chargings.map(charging => 
      this.getUserNameByChargingId(charging.charging_id).pipe(
        map((userName: string) => userName),
        catchError(this.errorHandler)
      )
    );
    return forkJoin(userRequests);
  }
  
  getAllChargingTimes(): Observable<any> {
    const token = localStorage.getItem('authToken');
    return this.http.get<any>(`${this.apiUrl}/api/v1/charging/allchargingtimes`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }
  
  getAllChargingDetails(): Observable<any> {
    const token = localStorage.getItem('authToken');
    return this.http.get<any>(`${this.apiUrl}/api/v1/charging/allchargingdetails`, {
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