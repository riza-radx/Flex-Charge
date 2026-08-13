import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class UserGroupMembersService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "http://localhost:3000";
  private apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  // Get All User Group Members
  // getAllUserGroupMembers() {
  //   const url = `${this.apiUrl}/api/v1/userGroupMembers/allusergroupmembers`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }
  getAllUserGroupMembers() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroupMembers/allusergroupmembers`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get User Group Member
  // getUserGroupMember(id: any) {
  //   const url = `${this.apiUrl}/api/v1/userGroupMembers/usergrmemberbyid/${id}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getUserGroupMember(id: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroupMembers/usergrmemberbyid/${id}`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get User Group Member By User Group
  // getUserGroupMemberByUserGroup(userGroupId: any) {
  //   const url = `${this.apiUrl}/api/v1/userGroupMembers/usergroupmemberbygroupid/${userGroupId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getUserGroupMemberByUserGroup(userGroupId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroupMembers/usergroupmemberbygroupid/${userGroupId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get User Group Member By User
  // getUserGroupMemberByUser(userId: any) {
  //   const url = `${this.apiUrl}/api/v1/userGroupMembers/usergroupmemberbyuserid/${userId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getUserGroupMemberByUser(userId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroupMembers/usergroupmemberbyuserid/${userId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get User Group Member By Type
  // getUserGroupMemberByType(type: any) {
  //   const url = `${this.apiUrl}/api/v1/userGroupMembers/usergroupmemberbytype/${type}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getUserGroupMemberByType(type: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroupMembers/usergroupmemberbytype/${type}`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  // // Add User Group Member
  // addUserGroupMember(body: any) {
  //   const url = `${this.apiUrl}/api/v1/userGroupMembers/addusergroupmember`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Update User Group Member
  // updateUserGroupMember(id: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/userGroupMembers/updateusergroupmember/${id}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Delete User Group Member
  // deleteUserGroupMember(id: any) {
  //   const url = `${this.apiUrl}/api/v1/userGroupMembers/deleteusergroupmember/${id}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // Add User Group Member
  addUserGroupMember(body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroupMembers/addusergroupmember`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Update User Group Member
  updateUserGroupMember(id: any, body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroupMembers/updateusergroupmember/${id}`;
    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Delete User Group Member
  deleteUserGroupMember(id: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/userGroupMembers/deleteusergroupmember/${id}`;
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
