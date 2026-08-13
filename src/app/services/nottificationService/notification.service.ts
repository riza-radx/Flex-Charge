import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, Observer } from "rxjs";
import { map } from 'rxjs/operators';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "http://localhost:3000";
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


  // getIPInfo() {
  //   const url = 'https://pro.ip-api.com/json/?key=0lR0QzRGYyY5L08';
  //   return this.httpClient.get(url, {
  //     headers: new HttpHeaders().append('Content-Type', 'application/json'),
  //   }).pipe(catchError(this.errorHandler));
  // }

  getIPInfo() {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = 'https://pro.ip-api.com/json/?key=0lR0QzRGYyY5L08';
    return this.httpClient.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }
  // Get All Notifications
  // getAllNotifications(timezone: any) {
  //   const encodedTimezone = encodeURIComponent(timezone);
  //   const url = `${this.apiUrl}/api/v1/notification/allNotifications/${encodedTimezone}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }
  getAllNotifications(timezone: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const encodedTimezone = encodeURIComponent(timezone);
    const url = `${this.apiUrl}/api/v1/notification/allNotifications/${encodedTimezone}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Get Notification
  // getNotification(id: any) {
  //   const url = `${this.apiUrl}/api/v1/notification/notificationsbyid/${id}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getNotification(id: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/notification/notificationsbyid/${id}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }
  // Get Notifications By Type
  // getNotificationByType(type: any, timezone: any) {
  //   const encodedTimezone = encodeURIComponent(timezone);
  //   const url = `${this.apiUrl}/api/v1/notification/notificationsbytype/${type}/${encodedTimezone}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getNotificationByType(type: any, timezone: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const encodedTimezone = encodeURIComponent(timezone);
    const url = `${this.apiUrl}/api/v1/notification/notificationsbytype/${type}/${encodedTimezone}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Get Notification By Description
  // getNotificationByDescription(description: any) {
  //   const url = `${this.apiUrl}/api/v1/notification/notificationsbydescription/${description}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getNotificationByDescription(description: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/notification/notificationsbydescription/${description}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Get Notification By User
  // getNotificationByUser(userId: any, timezone: any) {
  //   const encodedTimezone = encodeURIComponent(timezone);
  //   const url = `${this.apiUrl}/api/v1/notification/notificationsbyuser/${userId}/${encodedTimezone}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getNotificationByUser(userId: any, timezone: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const encodedTimezone = encodeURIComponent(timezone);
    const url = `${this.apiUrl}/api/v1/notification/notificationsbyuser/${userId}/${encodedTimezone}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Get Notification By Company
  // getNotificationByCompany(companyId: any, timezone: any) {
  //   const encodedTimezone = encodeURIComponent(timezone);
  //   const url = `${this.apiUrl}/api/v1/notification/notificationsbycompany/${companyId}/${encodedTimezone}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getNotificationByCompany(companyId: any, timezone: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const encodedTimezone = encodeURIComponent(timezone);
    const url = `${this.apiUrl}/api/v1/notification/notificationsbycompany/${companyId}/${encodedTimezone}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Get Notifications By User Groups
  // getNotificationByUserGroup(userGroupId: any, timezone: any) {
  //   const encodedTimezone = encodeURIComponent(timezone);
  //   const url = `${this.apiUrl}/api/v1/notification/notificationsbyusergroup/${userGroupId}/${encodedTimezone}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getNotificationByUserGroup(userGroupId: any, timezone: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const encodedTimezone = encodeURIComponent(timezone);
    const url = `${this.apiUrl}/api/v1/notification/notificationsbyusergroup/${userGroupId}/${encodedTimezone}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // // Get Notifications By Partner
  // getNotificationByPartner(partnerId: any, timezone: any) {
  //   const encodedTimezone = encodeURIComponent(timezone);
  //   const url = `${this.apiUrl}/api/v1/notification/notificationsbypartner/${partnerId}/${encodedTimezone}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getNotificationByPartner(partnerId: any, timezone: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const encodedTimezone = encodeURIComponent(timezone);
    const url = `${this.apiUrl}/api/v1/notification/notificationsbypartner/${partnerId}/${encodedTimezone}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Get Notifications By Date
  // getNotificationByDate(date: any) {
  //   const url = `${this.apiUrl}/api/v1/notification/notificationsbydate/${date}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getNotificationByDate(date: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/notification/notificationsbydate/${date}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Create Notification
  // createNotification(body: any) {
  //   const url = `${this.apiUrl}/api/v1/notification/createnotification`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  createNotification(body: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/notification/createnotification`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  createRemoteNotification(body: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/notification/createremotenotification`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // New search method
  // searchNotifications(query: string): Observable<any> {
  //   const url = `${this.apiUrl}/api/v1/notification/search?q=${encodeURIComponent(query)}`;
  //   return this.httpClient.get(url, {
  //     headers: new HttpHeaders().append('Content-Type', 'application/json'),
  //     withCredentials: true,
  //   }).pipe(
  //     catchError(this.errorHandler)
  //   );
  // }
  searchNotifications(query: string): Observable<any> {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/notification/search?q=${encodeURIComponent(query)}`;
    return this.httpClient.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
      , withCredentials: true,
    }).pipe(
      catchError(this.errorHandler)
    );
  }

  // markNotificationsAsRead(userId: string): Observable<any> {
  //   const url = `${this.apiUrl}/api/v1/notification/read/${userId}` 
  //   return this.httpClient.put(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  markNotificationsAsRead(userId: string): Observable<any> {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/notification/read/${userId}`;
    return this.httpClient.put(url, {}, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  createLocalNotification(body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/notification/createlocalnotification`;
    return this.httpClient.post(url, body, {
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

  // searchNotifications(query: string) {
  //   const url = `${this.apiUrl}/api/v1/notification/search?q=${encodeURIComponent(query)}`; 
  //   return this.httpClient.get<{ notifications: any[] }>(url);
  // }

}
