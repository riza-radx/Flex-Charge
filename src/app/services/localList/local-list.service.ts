import { logger } from '@core/logger';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class LocalListService {
  // private apiUrl = "https://api.radx.app";
  private apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }

  private errorHandler(error: any) {
    logger.error('Error:', error);
    return throwError(error);
  }

  getAllChargerLocalList(filters: any = {}) {
    const url = `${this.apiUrl}/api/v1/chargerLocalList/allchargerLocalList`;
    return this.httpClient.get(url, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(catchError(this.errorHandler));
  }
  
  getChargerLocalList(cllId: any, filters: any = {}) {
    const url = `${this.apiUrl}/api/v1/chargerLocalList/chargerLocalList/${cllId}`;
    return this.httpClient.get(url, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(catchError(this.errorHandler));
  }
  
  getChargerLocalListByCompany(companyId: any, filters: any = {}) {
    const url = `${this.apiUrl}/api/v1/chargerLocalList/chargerLocalList/company/${companyId}`;
    return this.httpClient.get(url, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(catchError(this.errorHandler));
  }
  
  getChargerLocalListByUser(userId: any, filters: any = {}) {
    const url = `${this.apiUrl}/api/v1/chargerLocalList/chargerLocalList/user/${userId}`;
    return this.httpClient.get(url, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(catchError(this.errorHandler));
  }
  
  getChargerLocalListByUserGroup(userGroupId: any, filters: any = {}) {
    const url = `${this.apiUrl}/api/v1/chargerLocalList/chargerLocalList/usergroup/${userGroupId}`;
    return this.httpClient.get(url, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(catchError(this.errorHandler));
  }
  
  getChargerLocalListByCharger(chargerId: any) {
    const url = `${this.apiUrl}/api/v1/chargerLocalList/chargerLocalListByCharger/${chargerId}`;
    return this.httpClient.get(url, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(catchError(this.errorHandler));
  }
  
  getChargerLocalListByPartner(partnerId: any, filters: any = {}) {
    const url = `${this.apiUrl}/api/v1/chargerLocalList/chargerLocalList/partner/${partnerId}`;
    return this.httpClient.get(url, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(catchError(this.errorHandler));
  }
  
  getChargerLocalListByCard(cardId: any, filters: any = {}) {
    const url = `${this.apiUrl}/api/v1/chargerLocalList/chargerLocalList/card/${cardId}`;
    return this.httpClient.get(url, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(catchError(this.errorHandler));
  }

  addChargerLocalList(chargerId: any, data: any) {
    const url = `${this.apiUrl}/api/v1/chargerLocalList/addChargerLocalList/${chargerId}`;
    return this.httpClient.post(url, data, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(catchError(this.errorHandler));
  }
  
  // Service for deleting a Charger Local List
  deleteChargerLocalList(cllId: any) {
    const url = `${this.apiUrl}/api/v1/chargerLocalList/deleteChargerLocalList/${cllId}`;
    return this.httpClient.delete(url, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(catchError(this.errorHandler));
  }
  
}
