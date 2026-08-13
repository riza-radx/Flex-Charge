import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { BehaviorSubject, catchError, map, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All Vehicles
  // getAllVehicles(filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/vehicle/allvehicles`
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
  getAllVehicles(filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/vehicle/allvehicles`;
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
        .set('Authorization', `Bearer ${token}`)
        .append('Content-Type', 'application/json')
    }).pipe(catchError(this.errorHandler));
  }

  // Get Vehicle
  // getVehicle(vehicleId: any) {
  //   const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbyid/${vehicleId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getVehicle(vehicleId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbyid/${vehicleId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .append('Content-Type', 'application/json')
    }).pipe(catchError(this.errorHandler));
  }
  
  // Get Vehicle By Vin Code
  // getVehicleByVinCode(vinCode: any) {
  //   const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbyvincode/${vinCode}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getVehicleByVinCode(vinCode: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbyvincode/${vinCode}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .append('Content-Type', 'application/json')
    }).pipe(catchError(this.errorHandler));
  }
  // Get Vehicle By Vehicle Number
  // getVehicleByVehicleNumber(vehicleNumber: any) {
  //   const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbynumber/${vehicleNumber}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getVehicleByVehicleNumber(vehicleNumber: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbynumber/${vehicleNumber}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .append('Content-Type', 'application/json')
    }).pipe(catchError(this.errorHandler));
  }

  // Get Vehicle By Brand
  // getVehicleByBrand(vehicleBrand: any) {
  //   const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbybrand/${vehicleBrand}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getVehicleByBrand(vehicleBrand: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbybrand/${vehicleBrand}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .append('Content-Type', 'application/json')
    }).pipe(catchError(this.errorHandler));
  }

  // Get Vehicle By Model
  // getVehicleByModel(vehicleModel: any) {
  //   const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbymodel/${vehicleModel}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getVehicleByModel(vehicleModel: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbymodel/${vehicleModel}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .append('Content-Type', 'application/json')
    }).pipe(catchError(this.errorHandler));
  }

  // Get Vehicle By Year
  // getVehicleByYear(vehicleYear: any) {
  //   const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbyyear/${vehicleYear}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getVehicleByYear(vehicleYear: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbyyear/${vehicleYear}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .append('Content-Type', 'application/json')
    }).pipe(catchError(this.errorHandler));
  }

  // Get Vehicle By User
  getVehicleByCurrentUser(filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbycurrentuserid`
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
      // headers: new HttpHeaders().append('Content-Type', 'application/json')
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }
  // Get Vehicle By Current User
  // getVehicleByUser(userId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbyuserid/${userId}`
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
  getVehicleByUser(userId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbyuserid/${userId}`;
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
        .set('Authorization', `Bearer ${token}`)
        .append('Content-Type', 'application/json')
    }).pipe(catchError(this.errorHandler));
  }

  // Get Vehicle By Company
  // getVehicleByCompany(companyId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbycompanyid/${companyId}`
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
  getVehicleByCompany(companyId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbycompanyid/${companyId}`;
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
        .set('Authorization', `Bearer ${token}`)
        .append('Content-Type', 'application/json')
    }).pipe(catchError(this.errorHandler));
  }

  // Get Vehicle By User Group
  // getVehicleByUserGroup(userGroupId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbyusergroupid/${userGroupId}`
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
  getVehicleByUserGroup(userGroupId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbyusergroupid/${userGroupId}`;
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
        .set('Authorization', `Bearer ${token}`)
        .append('Content-Type', 'application/json')
    }).pipe(catchError(this.errorHandler));
  }

  // Get Vehicle By Created Time
  // getVehicleByCreatedTime(createdTime: any) {
  //   const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbycreatedtime/${createdTime}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getVehicleByCreatedTime(createdTime: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/vehicle/vehiclesbycreatedtime/${createdTime}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .append('Content-Type', 'application/json')
    }).pipe(catchError(this.errorHandler));
  }

  // // Add Vehicle
  // addVehicle(body: any) {
  //   const url = `${this.apiUrl}/api/v1/vehicle/createvehicles`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Update Vehicle
  // updateVehicle(vehicleId: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/vehicle/updatevehicles/${vehicleId}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Delete Vehicle
  // deleteVehicle(vehicleId: any) {
  //   const url = `${this.apiUrl}/api/v1/vehicle/deletevehicles/${vehicleId}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // Add Vehicle
  addVehicle(body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/vehicle/createvehicles`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Update Vehicle
  updateVehicle(vehicleId: any, body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/vehicle/updatevehicles/${vehicleId}`;
    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }

  // Delete Vehicle
  deleteVehicle(vehicleId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/vehicle/deletevehicles/${vehicleId}`;
    return this.httpClient.delete(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    });
  }


  //GEt number of vehicle added
  // getCurrentMonthVehicleCount(): Observable<number> {
  //   return this.httpClient.get<{ success: boolean; count?: number; message?: string }>(this.apiUrl).pipe(
  //     map(response => {
  //       if (response.success) {
  //         return response.count || 0;
  //       } else {
  //         throw new Error(response.message || 'Failed to retrieve count');
  //       }
  //     })
  //   );
  // }
  getCurrentMonthVehicleCount(): Observable<number> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/vehicle/vehicles/current-month/count`; // Ensure this is the correct URL
    return this.httpClient.get<{ success: boolean; count?: number; message?: string }>(url, {
      observe: 'body',
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
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
  // getCurrentMonthCount(): Observable<number> {
  //   const url = `${this.apiUrl}/api/v1/vehicle/vehicles/current-month/count`;
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
    const url = `${this.apiUrl}/api/v1/vehicle/vehicles/current-month/count`;
    return this.httpClient.get<{ success: boolean; count?: number; message?: string }>(url, {
      observe: 'body',
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
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
  errorHandler(httpErrorResponse: HttpErrorResponse) {
    return new Observable((observer: Observer<any>) => {
      observer.error(httpErrorResponse);
    })
  }

}
