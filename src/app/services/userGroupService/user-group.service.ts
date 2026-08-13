import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { BehaviorSubject, catchError, map, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class UserGroupService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All User Groups
  // getAllUserGroups() {
  //   const url = `${this.apiUrl}/api/v1/userGroup/allusergroups`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }
  // 🆕 Accept optional filters (e.g. partner_id, allow_pay_as_you_go, split_wallet) as query params.
  getAllUserGroups(filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroup/allusergroups`;
    const params = new HttpParams({ fromObject: filters });
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`),
      params
    }).pipe(catchError(this.errorHandler));
  }

  // // Get User Group
  // getUserGroup(id: any) {
  //   const url = `${this.apiUrl}/api/v1/userGroup/usergroupbyid/${id}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getUserGroup(id: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroup/usergroupbyid/${id}`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get User Group For The Report
  // usergroupbyidForTheReport(id: any) {
  //   const url = `${this.apiUrl}/api/v1/userGroup/usergroupbyidForTheReport/${id}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  usergroupbyidForTheReport(id: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroup/usergroupbyidForTheReport/${id}`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get User Group By Name
  // getUserGroupByName(userGroupName: any) {
  //   const url = `${this.apiUrl}/api/v1/userGroup/usergroupbyname/${userGroupName}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getUserGroupByName(userGroupName: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroup/usergroupbyname/${userGroupName}`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get User Group By Address
  // getUserGroupByAddress(address: any) {
  //   const url = `${this.apiUrl}/api/v1/userGroup/usergroupbyaddress/${address}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getUserGroupByAddress(address: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroup/usergroupbyaddress/${address}`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get User Group By City
  // getUserGroupByCity(city: any) {
  //   const url = `${this.apiUrl}/api/v1/userGroup/usergroupbycity/${city}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getUserGroupByCity(city: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroup/usergroupbycity/${city}`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get User Group By Country
  // getUserGroupByCountry(country: any) {
  //   const url = `${this.apiUrl}/api/v1/userGroup/usergroupbycountry/${country}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getUserGroupByCountry(country: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroup/usergroupbycountry/${country}`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get User Group By Phone
  // getUserGroupByPhone(phone: any) {
  //   const url = `${this.apiUrl}/api/v1/userGroup/usergroupbyphone/${phone}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getUserGroupByPhone(phone: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroup/usergroupbyphone/${phone}`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get User Group By Email
  // getUserGroupByEmail(email: any) {
  //   const url = `${this.apiUrl}/api/v1/userGroup/usergroupbyemail/${email}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getUserGroupByEmail(email: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroup/usergroupbyemail/${email}`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get User Group By Company
  // getUserGroupByCompany(companyId: any) {
  //   const url = `${this.apiUrl}/api/v1/userGroup/usergroupbycompany/${companyId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  // getUserGroupByCompany(companyId: any) {
  //   const token = localStorage.getItem('authToken');
  //   const url = `${this.apiUrl}/api/v1/userGroup/usergroupbycompany/${companyId}`;
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     headers: new HttpHeaders()
  //       .set('Content-Type', 'application/json')
  //       .set('Authorization', `Bearer ${token}`)
  //   }).pipe(catchError(this.errorHandler));
  // }

  getUserGroupByCompany(companyId: any, filters: any = {}): Observable<any> {
    const token = localStorage.getItem('authToken');
    const params = new HttpParams({ fromObject: filters });
  
    const url = `${this.apiUrl}/api/v1/userGroup/usergroupbycompany/${companyId}`;
    return this.httpClient.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`),
      params,
      withCredentials: true
    });
  }

  // // Add User Group
  // addUserGroup(body: any): Observable<any> {
  //   const url = `${this.apiUrl}/api/v1/userGroup/createusergroup`
  //   return this.httpClient.post(url, body)
  // }

  // // Update User Group
  // updateUserGroup(userGroupId: any, body: any): Observable<any> {
  //   const url = `${this.apiUrl}/api/v1/userGroup/updateusergroup/${userGroupId}`
  //   return this.httpClient.put(url, body)
  // }

  // // Delete User Group
  // deleteUserGroup(userGroupId: any) {
  //   const url = `${this.apiUrl}/api/v1/userGroup/deleteusergroup/${userGroupId}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // Add User Group
  // addUserGroup(body: any): Observable<any> {
  //   const token = localStorage.getItem('authToken');
  //   const url = `${this.apiUrl}/api/v1/userGroup/createusergroup`;
  //   return this.httpClient.post(url, body, {
  //     headers: new HttpHeaders()
  //       .append('Content-Type', 'application/json')
  //       .set('Authorization', `Bearer ${token}`) // Add Authorization header
  //   });
  // }

  addUserGroup(body: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroup/createusergroup`;
    return this.httpClient.post(url, body, {
      headers: new HttpHeaders() 
        // .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }



  // Update User Group
  updateUserGroup(userGroupId: any, body: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroup/updateusergroup/${userGroupId}`;
    return this.httpClient.put(url, body, {
      headers: new HttpHeaders()
        // .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Delete User Group
  deleteUserGroup(userGroupId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroup/deleteusergroup/${userGroupId}`;
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
  //   const url = `${this.apiUrl}/api/v1/userGroup/userGroups/current-month/count`;
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
    const url = `${this.apiUrl}/api/v1/userGroup/userGroups/current-month/count`;
    return this.httpClient.get<{ success: boolean; count?: number; message?: string }>(url, {
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
