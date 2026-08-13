import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class RatePerDaysService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All Rate Per Days
  // getAllRatePerDays() {
  //   const url = `${this.apiUrl}/api/v1/ratePerDays/getallratesperday`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }
  getAllRatePerDays() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/ratePerDays/getallratesperday`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Rate Per Day
  // getRatePerDay(id: any) {
  //   const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybyid/${id}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getRatePerDay(id: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybyid/${id}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  // Get Rate Per Day By Rate
  // getRatePerDayByRate(rateId: any) {
  //   const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybyrateid/${rateId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getRatePerDayByRate(rateId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybyrateid/${rateId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Rate Per Day By Day
  // getRatePerDayByDay(day: any) {
  //   const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybyday/${day}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getRatePerDayByDay(day: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybyday/${day}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Rate Per Day By Day Time
  // getRatePerDayByDayTime(dayTime: any) {
  //   const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybydaytime/${dayTime}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getRatePerDayByDayTime(dayTime: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybydaytime/${dayTime}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Rate Per Day By Month
  // getRatePerDayByMonth(month: any) {
  //   const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybymonth/${month}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getRatePerDayByMonth(month: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybymonth/${month}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Rate Per Day By Year
  // getRatePerDayByYear(year: any) {
  //   const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybyyear/${year}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getRatePerDayByYear(year: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybyyear/${year}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }


  // Get Rate Per Day By User
  // getRatePerDayByUser(userId: any) {
  //   const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybyuser/${userId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getRatePerDayByUser(userId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybyuser/${userId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Rate Per Day By User Group
  // getRatePerDayByUserGroup(userGroupId: any) {
  //   const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybyusegrroup/${userGroupId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getRatePerDayByUserGroup(userGroupId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybyusegrroup/${userGroupId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // // Get Rate Per Day By Created Date
  // getRatePerDayByCreatedDate(dayCreated: any) {
  //   const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybydaycreated/${dayCreated}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getRatePerDayByCreatedDate(dayCreated: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybydaycreated/${dayCreated}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Rate Per Day By Created By
  // getRatePerDayByCreatedBy(dayCreatedBy: any) {
  //   const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybydaycreatedby/${dayCreatedBy}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getRatePerDayByCreatedBy(dayCreatedBy: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/ratePerDays/getrateperdaybydaycreatedby/${dayCreatedBy}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // // Add Rate Per Day
  // addRatePerDay(body: any) {
  //   const url = `${this.apiUrl}/api/v1/ratePerDays/createrateperday`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Update Rate Per Day
  // updateRatePerDay(id: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/ratePerDays/updaterateperday/${id}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Delete Rate Per Day
  // deleteRatePerDay(ratePerDayId: any) {
  //   const url = `${this.apiUrl}/api/v1/ratePerDays/deleterateperday/${ratePerDayId}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // Add Rate Per Day
  addRatePerDay(body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/ratePerDays/createrateperday`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Update Rate Per Day
  updateRatePerDay(id: any, body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/ratePerDays/updaterateperday/${id}`;
    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Delete Rate Per Day
  deleteRatePerDay(ratePerDayId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/ratePerDays/deleterateperday/${ratePerDayId}`;
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
