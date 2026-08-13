import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Observer } from 'rxjs';
import { environment } from '../environment';

export interface EVVehicle {
  brand: string;
  model: string;
  year: string;  // If year is a string or number, adjust accordingly
}

@Injectable({
  providedIn: 'root'
})
export class EvVehicleService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All EV Vehicles
  // getAllEVVehicles(): Observable<any> {  // Use 'any' type for the response
  //   const url = `${this.apiUrl}/api/v1/evVehicle/evvehicles`;
  //   return this.httpClient.get<any>(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(
  //     catchError(this.errorHandler)  // Assuming errorHandler is defined elsewhere
  //   );
  // }
  getAllEVVehicles(): Observable<any> {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/evVehicle/evvehicles`;
  
    return this.httpClient.get<any>(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(
      catchError(this.errorHandler) // Assuming errorHandler is defined elsewhere
    );
  }

  // Get EV Vehicle by ID
  // getEVVehicleById(evVehicleId: any) {
  //   const url = `${this.apiUrl}/api/v1/evVehicle/evvehicles/${evVehicleId}`;
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler));
  // }
  getEVVehicleById(evVehicleId: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/evVehicle/evvehicles/${evVehicleId}`;
  
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Get EV Vehicle by Brand
  // getEVVehicleByBrand(brand: any) {
  //   const url = `${this.apiUrl}/api/v1/evVehicle/evvehicles/brand/${brand}`;
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler));
  // }

  getEVVehicleByBrand(brand: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/evVehicle/evvehicles/brand/${brand}`;
  
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }
  // Get EV Vehicle by Model
  // getEVVehicleByModel(model: any) {
  //   const url = `${this.apiUrl}/api/v1/evVehicle/evvehicles/model/${model}`;
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler));
  // }
  getEVVehicleByModel(model: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/evVehicle/evvehicles/model/${model}`;
  
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Get EV Vehicle by Year
  // getEVVehicleByYear(year: any) {
  //   const url = `${this.apiUrl}/api/v1/evVehicle/evvehicles/year/${year}`;
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler));
  // }

  getEVVehicleByYear(year: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/evVehicle/evvehicles/year/${year}`;
  
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }
  // Add EV Vehicle
  // addEVVehicle(body: any) {
  //   const url = `${this.apiUrl}/api/v1/evVehicle/addevvehicles`;
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler));
  // }
  addEVVehicle(body: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/evVehicle/addevvehicles`;
  
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Update EV Vehicle
  // updateEVVehicle(evVehicleId: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/evVehicle/updateevvehicles/${evVehicleId}`;
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler));
  // }
  updateEVVehicle(evVehicleId: any, body: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/evVehicle/updateevvehicles/${evVehicleId}`;
  
    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }
  

  // Delete EV Vehicle
  // deleteEVVehicle(evVehicleId: any) {
  //   const url = `${this.apiUrl}/api/v1/evVehicle/deleteevvehicles/${evVehicleId}`;
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler));
  // }
  deleteEVVehicle(evVehicleId: any) {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const url = `${this.apiUrl}/api/v1/evVehicle/deleteevvehicles/${evVehicleId}`;
  
    return this.httpClient.delete(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Error Handler
  errorHandler(httpErrorResponse: HttpErrorResponse) {
    return new Observable((observer: Observer<any>) => {
      observer.error(httpErrorResponse);
    });
  }
}
