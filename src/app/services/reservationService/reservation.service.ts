import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, map, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All Reservations
  // getAllReservations() {
  //   const url = `${this.apiUrl}/api/v1/reservation/allreservations`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }
  getAllReservations() {
    const token = localStorage.getItem('authToken');  // Retrieve the token from localStorage
    const url = `${this.apiUrl}/api/v1/reservation/allreservations`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('Authorization', `Bearer ${token}`)  // Add Authorization header
    })
    .pipe(catchError(this.errorHandler));
  }

  // Get Reservation
  // getReservation(id: any) {
  //   const url = `${this.apiUrl}/api/v1/reservation/reservationbyid/${id}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getReservation(id: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reservation/reservationbyid/${id}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('Authorization', `Bearer ${token}`)
    })
    .pipe(catchError(this.errorHandler));
  }
  // Get Reservation By User
  // getReservationByUser(userId: any) {
  //   const url = `${this.apiUrl}/api/v1/reservation/reservationbyuser/${userId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getReservationByUser(userId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reservation/reservationbyuser/${userId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('Authorization', `Bearer ${token}`)
    })
    .pipe(catchError(this.errorHandler));
  }

  // Get Reservation By User
  // getReservationByCurrentUser() {
  //   const token = localStorage.getItem('authToken');
  //   const url = `${this.apiUrl}/api/v1/reservation/reservationbycurrentUser`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     // headers: new HttpHeaders().append('Content-Type', 'application/json')
  //     headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getReservationByCurrentUser() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reservation/reservationbycurrentUser`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    })
    .pipe(catchError(this.errorHandler));
  }
  // Get Reservation By Charger
  // getReservationByCharger(chargerId: any) {
  //   const url = `${this.apiUrl}/api/v1/reservation/reservationbycharger/${chargerId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getReservationByCharger(chargerId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reservation/reservationbycharger/${chargerId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('Authorization', `Bearer ${token}`)
    })
    .pipe(catchError(this.errorHandler));
  }

  // Get Reservation By Date
  // getReservationByDate(date: any) {
  //   const url = `${this.apiUrl}/api/v1/reservation/reservationbydate/${date}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getReservationByDate(date: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reservation/reservationbydate/${date}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('Authorization', `Bearer ${token}`)
    })
    .pipe(catchError(this.errorHandler));
  }
  // Get Reservation By Time
  // getReservationByTime(time: any) {
  //   const url = `${this.apiUrl}/api/v1/reservation/reservationbytime/${time}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getReservationByTime(time: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reservation/reservationbytime/${time}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('Authorization', `Bearer ${token}`)
    })
    .pipe(catchError(this.errorHandler));
  }

  // Add Reservation
  // addReservation(body: any) {
  //   const url = `${this.apiUrl}/api/v1/reservation/createreservation`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  addReservation(body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reservation/createreservation`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('Authorization', `Bearer ${token}`)
    });
  }

  // Update Reservation
  // updateReservation(id: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/reservation/updatereservation/${id}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  updateReservation(id: any, body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reservation/updatereservation/${id}`;
    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('Authorization', `Bearer ${token}`)
    });
  }

  // Delete Reservation
  // deleteReservation(id: any) {
  //   const url = `${this.apiUrl}/api/v1/reservation/deletereservation/${id}`
  //   return this.httpClient.put(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  deleteReservation(id: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reservation/deletereservation/${id}`;
    return this.httpClient.put(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('Authorization', `Bearer ${token}`)
    });
  }

  errorHandler(httpErrorResponse: HttpErrorResponse) {
    return new Observable((observer: Observer<any>) => {
      observer.error(httpErrorResponse);
    })
  }
  // getCurrentMonthReservationCount(): Observable<number> {
  //   const url = `${this.apiUrl}/api/v1/reservation/reservations/current-month/count`;
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
  getCurrentMonthReservationCount(): Observable<number> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reservation/reservations/current-month/count`;
    return this.httpClient.get<{ success: boolean; count?: number; message?: string }>(url, {
      headers: new HttpHeaders()
        .append('Authorization', `Bearer ${token}`)
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

  // getReservationsByPartnerId(partnerId: number): Observable<any> {
  //   const url = `${this.apiUrl}/api/v1/reservation/reservations/partner/${partnerId}`;
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(
  //     catchError(this.errorHandler)
  //   );
  // }
  getReservationsByPartnerId(partnerId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reservation/reservations/partner/${partnerId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('Authorization', `Bearer ${token}`)
    }).pipe(
      catchError(this.errorHandler)
    );
  }

  // getReservationsByCompanyId(companyId: number): Observable<any> {
  //   const url = `${this.apiUrl}/api/v1/reservation/reservations/company/${companyId}`;
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(
  //     catchError(this.errorHandler)
  //   );
  // }
  getReservationsByCompanyId(companyId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/reservation/reservations/company/${companyId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('Authorization', `Bearer ${token}`)
    }).pipe(
      catchError(this.errorHandler)
    );
  }

}
