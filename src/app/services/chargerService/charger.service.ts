import { logger } from '@core/logger';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { BehaviorSubject, catchError, map, Observable, Observer, throwError } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ChargerService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;
  
  constructor(private httpClient: HttpClient) { }

  // Get All Chargers
  // getAllChargers(filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/charger/allchargers`
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
  getAllChargers(filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/allchargers`;

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
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charger
  // getCharger(chargerId: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/chargerbyid/${chargerId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getCharger(chargerId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/chargerbyid/${chargerId}`;

    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charger By Name
  // getChargerByName(chargerName: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/chargerbyname/${chargerName}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargerByName(chargerName: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/chargerbyname/${chargerName}`;

    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charger By Charger Type
  // getChargerByType(chargerType: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/chargerbytype/${chargerType}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargerByType(chargerType: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/chargerbytype/${chargerType}`;

    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  // Get Charger By Charger Partner
  // getChargerByPartner(partnerId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/charger/chargerbypartner/${partnerId}`
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
  getChargerByPartner(partnerId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/chargerbypartner/${partnerId}`;

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
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  // Get Charger By Charger Company
  // getChargerByCompany(companyID: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/charger/chargerbycompany/${companyID}`
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
  getChargerByCompany(companyID: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/chargerbycompany/${companyID}`;

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
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charger By No Of Connector
  // getChargerByNoOsConnectors(noOfConnectors: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/chargerbynumberofconnectors/${noOfConnectors}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargerByNoOsConnectors(noOfConnectors: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/chargerbynumberofconnectors/${noOfConnectors}`;

    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charger By Charger Validity
  // getChargerByValidity(chargerValidity: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/chargerbyvalidity/${chargerValidity}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargerByValidity(chargerValidity: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/chargerbyvalidity/${chargerValidity}`;

    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charger By Status
  // getChargerByStatus(chargerStatus: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/chargerbystatus/${chargerStatus}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargerByStatus(chargerStatus: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/chargerbystatus/${chargerStatus}`;

    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charger By Location
  // getChargerByLocation(chargerLocation: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/charger/chargerbylocation/${chargerLocation}`
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

  getChargerByLocation(chargerLocation: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/chargerbylocation/${chargerLocation}`;

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
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charger By Rated Power
  // getChargerByRatedPower(chargerRatedPower: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/chargerbyratedpower/${chargerRatedPower}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargerByRatedPower(chargerRatedPower: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/chargerbyratedpower/${chargerRatedPower}`;

    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // //Stop transaction
  // stopTransaction(ocppId: any, chargingID: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/handleRemoteStopTransaction/${ocppId}/${chargingID}`;
  //   return this.httpClient.post(url, null, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json'),
  //   });
  // }

  // //Start transaction
  // startTransaction(ocppId: any, userId: any, connectorNo: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/handleRemoteStartTransaction/${ocppId}/${userId}/${connectorNo}`;
  //   console.log("startTransaction URL:", url);
  //   return this.httpClient.post(url, null, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json'),
  //   });
  // }

  // //Cancel Reservation
  // cancelReservation(ocppId: any, reservationId: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/handleCancelReservation/${ocppId}/${reservationId}`;
  //   return this.httpClient.post(url, null, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json'),
  //   });
  // }

  // //Create Reservation

  // addReservation(ocppId: any, body: any): Observable<any> {
  //   const url = `${this.apiUrl}/api/v1/charger/handleReserve/${ocppId}`;
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json'),
  //   });
  // }

  // Stop transaction
  stopTransaction(ocppId: any, chargingID: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/handleRemoteStopTransaction/${ocppId}/${chargingID}`;

    return this.httpClient.post(url, null, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }

  // Start transaction
  // startTransaction(ocppId: any, userId: any, connectorNo: any) {
  //   const token = localStorage.getItem('authToken');
  //   const url = `${this.apiUrl}/api/v1/charger/handleRemoteStartTransaction/${ocppId}/${userId}/${connectorNo}`;
  //   console.log("startTransaction URL:", url);

  //   return this.httpClient.post(url, null, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders()
  //       .set('Content-Type', 'application/json')
  //       .set('Authorization', `Bearer ${token}`)
  //   });
  // }
  startTransaction(ocppId: any, userId: any, connectorNo: any, reason: string) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/handleRemoteStartTransaction/${ocppId}/${userId}/${connectorNo}`;
    logger.log("startTransaction URL + reason: ", url, reason);

    const body = { reason };

    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }


  // Cancel Reservation
  cancelReservation(ocppId: any, reservationId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/handleCancelReservation/${ocppId}/${reservationId}`;

    return this.httpClient.post(url, null, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }

  // Create Reservation
  addReservation(ocppId: any, body: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/handleReserve/${ocppId}`;

    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        // .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }


  // // Create Charger
  // addCharger(body: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/addcharger`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }


  // // Update Charger
  // updateCharger(chargerId: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/updatecharger/${chargerId}`;
  //   return this.httpClient.put(url, body, {
  //     observe: 'response',  // Changed to observe 'response' to get full response including headers
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(
  //     map(response => response.body),  // Extracts only the body of the response (success and message)
  //     catchError(error => throwError(error)) // Handles any errors
  //   );
  // }
  // // Update Charger
  // updateNoofConnectorsCharger(chargerId: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/updateNoOfConnectorscharger/${chargerId}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Delete Charger
  // deleteCharger(chargerId: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/deletecharger/${chargerId}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // Create Charger
  addCharger(body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/addcharger`;

    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Update Charger
  updateCharger(chargerId: any, body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/updatecharger/${chargerId}`;

    return this.httpClient.put(url, body, {
      observe: 'response', // Get full response including headers
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(
      map(response => response.body), // Extracts only the body
      catchError(error => throwError(error)) // Error handling
    );
  }

  // 🆕 Rebill retroaktiv i energy_tariff_price per te gjitha sesionet e nje chargeri
  // brenda nje intervali date-ore. QASJA: VETEM COMPANY_ADMIN / COMPANY_ANALYST (backend gate).
  // Body: { startDatetime, endDatetime|null, rateId? | customHourlyPrices?[24] }
  rebillEnergyTariff(chargerId: any, body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/rebill-energy-tariff/${chargerId}`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Update No. of Connectors in Charger
  updateNoofConnectorsCharger(chargerId: any, body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/updateNoOfConnectorscharger/${chargerId}`;

    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Toggle Switch (Vega Charging) — ndez/fik prioritetin charger.rate_id > user.rate_id.
  // body: { enabled: boolean, until?: string | null }
  updateRatePriority(chargerId: any, body: { enabled: boolean; until?: string | null }) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/ratepriority/${chargerId}`;

    return this.httpClient.patch(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Delete Charger
  deleteCharger(chargerId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/deletecharger/${chargerId}`;

    return this.httpClient.delete(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Trigger Message
  // triggerMessage(ocppId: any, messageType: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/handleTriggerMessage/${ocppId}`;
  //   return this.httpClient.post(url,
  //     {
  //       messageType: messageType
  //     },
  //     {
  //       observe: 'body',
  //       withCredentials: true,
  //       headers: new HttpHeaders().append('Content-Type', 'application/json')
  //     }
  //   );
  // }
  triggerMessage(ocppId: any, messageType: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/handleTriggerMessage/${ocppId}`;
    return this.httpClient.post(url,
      {
        messageType: messageType
      },
      {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
      }
    );
  }

  // Get Diagnostics
  getDiagnostics(ocppId: any, payload: {
    location: string;
    startTime?: string;
    stopTime?: string;
    retries?: number;
    retryInterval?: number;
  }) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/handleGetDiagnostics/${ocppId}`;
    return this.httpClient.post(url, payload, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }

  // Latest GetDiagnostics status for a charger — for live UI feedback after sending
  getDiagnosticsStatus(ocppId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/getDiagnosticsStatus/${ocppId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }

  // List files on the FTP server filtered by ocpp_id prefix
  listDiagnosticsFiles(ocppId: string) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/diagnostics/ftp-list/${encodeURIComponent(ocppId)}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }

  // Stream a diagnostics file back from FTP as a blob the browser can save
  downloadDiagnosticsFile(fileName: string) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/diagnostics/ftp-download/${encodeURIComponent(fileName)}`;
    return this.httpClient.get(url, {
      responseType: 'blob',
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }

  // Get Composite Schedule
  // getCompositeSchedule(ocppId: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/handleGetCompositeSchedule/${ocppId}`
  //   return this.httpClient.post(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  getCompositeSchedule(ocppId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/handleGetCompositeSchedule/${ocppId}`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    return this.httpClient.post(url, {}, { headers });
  }

  // Data Transfer
  // dataTransfer(ocppId: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/handleDataTransfer/${ocppId}`
  //   return this.httpClient.post(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  dataTransfer(ocppId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/handleDataTransfer/${ocppId}`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    return this.httpClient.post(url, {}, { headers });
  }

  // Local List
  // localList(ocppId: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/handleLocalList/${ocppId}`
  //   return this.httpClient.post(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  localList(ocppId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/handleLocalList/${ocppId}`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    return this.httpClient.post(url, {}, { headers });
  }

  // Clear Cache
  // clearCache(ocppId: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/handleClearCache/${ocppId}`
  //   return this.httpClient.post(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  clearCache(ocppId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/handleClearCache/${ocppId}`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    return this.httpClient.post(url, {}, { headers });
  }

  // Change Availability
  // changeAvailability(ocppId: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/handleChangeAvailibility/${ocppId}`
  //   return this.httpClient.post(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  changeAvailability(ocppId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/handleChangeAvailibility/${ocppId}`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    return this.httpClient.post(url, {}, { headers });
  }

  // Reboot
  // reboot(ocppId: any) {
  //   const url = `${this.apiUrl}/api/v1/charger/handleReboot/${ocppId}`
  //   return this.httpClient.post(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  reboot(ocppId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charger/handleReboot/${ocppId}`;
    return this.httpClient.post(url, {}, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }


  // getCurrentMonthCount(): Observable<number> {
  //   const url = `${this.apiUrl}/api/v1/charger/chargers/current-month/count`;
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
    const url = `${this.apiUrl}/api/v1/charger/chargers/current-month/count`;
    return this.httpClient.get<{ success: boolean; count?: number; message?: string }>(url, {
      observe: 'body',
      withCredentials: true,
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
      })
    );
  }
  errorHandler(httpErrorResponse: HttpErrorResponse) {
    return new Observable((observer: Observer<any>) => {
      observer.error(httpErrorResponse);
    })
  }

}
