import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, map, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class RateService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "http://localhost:3000";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All Rates
  // getAllRates() {
  //   const url = `${this.apiUrl}/api/v1/rate/allrates`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }
  getAllRates() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/rate/allrates`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Rate
  // getRate(id: any) {
  //   const url = `${this.apiUrl}/api/v1/rate/ratesbyid/${id}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getRate(id: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/rate/ratesbyid/${id}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // 🆕 Kthen entitetet qe kane te aplikuar rate-in:
  //   - Purchase: vetem chargers
  //   - Sale:     chargers + users + user groups
  getRateUsage(rateId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/rate/usage/${rateId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Rate By Name
  // getRateByName(name: any) {
  //   const url = `${this.apiUrl}/api/v1/rate/ratesbyname/${name}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getRateByName(name: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/rate/ratesbyname/${name}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Rate By Company
  // getRateByCompany(companyId: any) {
  //   const url = `${this.apiUrl}/api/v1/rate/ratesbycompanyid/${companyId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getRateByCompany(companyId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/rate/ratesbycompanyid/${companyId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Rate By Default Price
  // getRateByDefaultPrice(defaultPrice: any) {
  //   const url = `${this.apiUrl}/api/v1/rate/ratesbydefaultPrice/${defaultPrice}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getRateByDefaultPrice(defaultPrice: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/rate/ratesbydefaultPrice/${defaultPrice}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Rate By Default Percentage
  // getRateByDefaultPercentage(percentage: any) {
  //   const url = `${this.apiUrl}/api/v1/rate/ratesbydefaultPercentage/${percentage}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getRateByDefaultPercentage(percentage: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/rate/ratesbydefaultPercentage/${percentage}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // // Create Rate
  // addRate(body: any) {
  //   const url = `${this.apiUrl}/api/v1/rate/createrate`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Update Rate
  // updateRate(rateId: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/rate/updaterate/${rateId}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Delete Rate
  // deleteRate(rateId: any) {
  //   const url = `${this.apiUrl}/api/v1/rate/deleterate/${rateId}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // Create Rate
  addRate(body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/rate/createrate`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Update Rate
  updateRate(rateId: any, body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/rate/updaterate/${rateId}`;
    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Delete Rate
  deleteRate(rateId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/rate/deleterate/${rateId}`;
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

  // getCurrentMonthCount(): Observable<number> {
  //   const url = `${this.apiUrl}/api/v1/rate/rates/current-month/count`;
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
    const url = `${this.apiUrl}/api/v1/rate/rates/current-month/count`;
    
    return this.httpClient.get<{ success: boolean; count?: number; message?: string }>(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
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
