import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { BehaviorSubject, catchError, map, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ChargerLocationService {


  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All Charger Locations
  // getAllChargerLocations(filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/chargerLocation/getallchargerlocations`
  //   // Convert filters object to HttpParams
  //   let params = new HttpParams();
  //   for (const key in filters) {
  //     if (filters.hasOwnProperty(key) && filters[key]) {
  //       params = params.set(key, filters[key]);
  //     }
  //   }
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     params: params,
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }
  getAllChargerLocations(filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargerLocation/getallchargerlocations`;
    // Convert filters object to HttpParams
    let params = new HttpParams();
    for (const key in filters) {
      if (filters.hasOwnProperty(key) && filters[key]) {
        params = params.set(key, filters[key]);
      }
    }
    return this.httpClient.get(url, {
      observe: 'body',
      params: params,
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`),
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charger Location
  // getChargerLocation(id: any) {
  //   const url = `${this.apiUrl}/api/v1/chargerLocation/getlocationbyid/${id}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getChargerLocation(id: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargerLocation/getlocationbyid/${id}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`),
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charger Location By Charger
  // getChargerLocationByCharger(chargerId: any) {
  //   const url = `${this.apiUrl}/api/v1/chargerLocation/locationbycharger/${chargerId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargerLocationByCharger(chargerId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargerLocation/locationbycharger/${chargerId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`),
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charger Location By Address
  // getChargerLocationByAddress(address: any) {
  //   const url = `${this.apiUrl}/api/v1/chargerLocation/locationbyaddress/${address}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargerLocationByAddress(address: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargerLocation/locationbyaddress/${address}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`),
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charger Location City
  // getChargerLocationByCity(city: any) {
  //   const url = `${this.apiUrl}/api/v1/chargerLocation/locationbycity/${city}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getChargerLocationByCity(city: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargerLocation/locationbycity/${city}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`),
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charger Location By Country
  // getChargerLocationByCountry(country: any) {
  //   const url = `${this.apiUrl}/api/v1/chargerLocation/locationbycountry/${country}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getChargerLocationByCountry(country: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargerLocation/locationbycountry/${country}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`),
    }).pipe(catchError(this.errorHandler));
  }
  // Get Charger Location By Company
  // getChargerLocationByCompany(companyId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/chargerLocation/locationbyCompany/${companyId}`
  //   // Convert filters object to HttpParams
  //   let params = new HttpParams();
  //   for (const key in filters) {
  //     if (filters.hasOwnProperty(key) && filters[key]) {
  //       params = params.set(key, filters[key]);
  //     }
  //   }
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     params: params,
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getChargerLocationByCompany(companyId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargerLocation/locationbyCompany/${companyId}`;
    // Convert filters object to HttpParams
    let params = new HttpParams();
    for (const key in filters) {
      if (filters.hasOwnProperty(key) && filters[key]) {
        params = params.set(key, filters[key]);
      }
    }
    return this.httpClient.get(url, {
      observe: 'body',
      params: params,
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`),
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charger Location By Partner
  // getChargerLocationByPartner(partnerId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/chargerLocation/locationbygetLocationByPartnerController/${partnerId}`
  //   // Convert filters object to HttpParams
  //   let params = new HttpParams();
  //   for (const key in filters) {
  //     if (filters.hasOwnProperty(key) && filters[key]) {
  //       params = params.set(key, filters[key]);
  //     }
  //   }
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     params: params,
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargerLocationByPartner(partnerId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargerLocation/locationbygetLocationByPartnerController/${partnerId}`;
    // Convert filters object to HttpParams
    let params = new HttpParams();
    for (const key in filters) {
      if (filters.hasOwnProperty(key) && filters[key]) {
        params = params.set(key, filters[key]);
      }
    }
    return this.httpClient.get(url, {
      observe: 'body',
      params: params,
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`),
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charger Location By Latitude And Longitude
  // getChargerLocationByLatAndLong(latitude: any, longitude: any) {
  //   const url = `${this.apiUrl}/api/v1/chargerLocation/getlocationbyid/${latitude}/${longitude}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargerLocationByLatAndLong(latitude: any, longitude: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargerLocation/getlocationbyid/${latitude}/${longitude}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`),
    }).pipe(catchError(this.errorHandler));
  }

  // Create Charger Location
  // createChargerLocation(body: any): Observable<{ success: boolean; message: string }> {
  //   const url = `${this.apiUrl}/api/v1/chargerLocation/createlocation`;
  
  //   return this.httpClient.post<{ success: boolean; message: string }>(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json'),
  //   });
  // }
  
  // // Update Charger Location
  // updateChargerLocation(id: any, body: any): Observable<{ success: boolean; message: string }> {
  //   const url = `${this.apiUrl}/api/v1/chargerLocation/upcatelocation/${id}`;
  
  //   return this.httpClient.put<{ success: boolean; message: string }>(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json'),
  //   });
  // }

  // // Delete Charger Location
  // deleteChargerLocation(id: any) {
  //   const url = `${this.apiUrl}/api/v1/chargerLocation/deletelocation/${id}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

    // Create Charger Location
    createChargerLocation(body: any): Observable<{ success: boolean; message: string }> {
      const token = localStorage.getItem('authToken');
      const url = `${this.apiUrl}/api/v1/chargerLocation/createlocation`;
    
      return this.httpClient.post<{ success: boolean; message: string }>(url, body, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`),
      }).pipe(catchError(this.errorHandler));
    }
    
    // Update Charger Location
    updateChargerLocation(id: any, body: any): Observable<{ success: boolean; message: string }> {
      const token = localStorage.getItem('authToken');
      const url = `${this.apiUrl}/api/v1/chargerLocation/upcatelocation/${id}`;
    
      return this.httpClient.put<{ success: boolean; message: string }>(url, body, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`),
      }).pipe(catchError(this.errorHandler));
    }
  
    // Delete Charger Location
    deleteChargerLocation(id: any) {
      const token = localStorage.getItem('authToken');
      const url = `${this.apiUrl}/api/v1/chargerLocation/deletelocation/${id}`;
      
      return this.httpClient.delete(url, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`),
      }).pipe(catchError(this.errorHandler));
    }
  

  errorHandler(httpErrorResponse: HttpErrorResponse) {
    return new Observable((observer: Observer<any>) => {
      observer.error(httpErrorResponse);
    })
  }
  getCurrentMonthCount(): Observable<number> {
    const url = `${this.apiUrl}/api/v1/chargerLocation/locations/current-month/count`;
    return this.httpClient.get<{ success: boolean; count?: number; message?: string }>(url).pipe(
      map(response => {
        if (response.success) {
          return response.count || 0;
        } else {
          throw new Error(response.message || 'Failed to retrieve count');
        }
      })
    );
  }
}
