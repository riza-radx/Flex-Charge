import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectorStatusService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All Connector Statuses
  // getAllConnectorStatuses() {
  //   const url = `${this.apiUrl}/api/v1/connectorStatus/allconnectorstatus`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }
  getAllConnectorStatuses() {
    const token = localStorage.getItem('authToken'); 
    const url = `${this.apiUrl}/api/v1/connectorStatus/allconnectorstatus`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Connector Status
  // getConnectoStatus(connectorStatusId: any) {
  //   const url = `${this.apiUrl}/api/v1/connectorStatus/connectorstatusbyid/${connectorStatusId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getConnectoStatus(connectorStatusId: any) {
    const token = localStorage.getItem('authToken'); 
    const url = `${this.apiUrl}/api/v1/connectorStatus/connectorstatusbyid/${connectorStatusId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Connector Status By Charger
  // getConnectoStatusByCharger(chargerId: any) {
  //   const url = `${this.apiUrl}/api/v1/connectorStatus/connectorstatusbycharger/${chargerId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getConnectoStatusByCharger(chargerId: any) {
    const token = localStorage.getItem('authToken'); 
    const url = `${this.apiUrl}/api/v1/connectorStatus/connectorstatusbycharger/${chargerId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // // Get Connector Status By Connector
  // getConnectoStatusByConnector(connectorId: any) {
  //   const url = `${this.apiUrl}/api/v1/connectorStatus/connectorstatusbyconnector/${connectorId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getConnectoStatusByConnector(connectorId: any) {
    const token = localStorage.getItem('authToken'); 
    const url = `${this.apiUrl}/api/v1/connectorStatus/connectorstatusbyconnector/${connectorId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Connector Status By Charger Status
  // getConnectoStatusByChargerStatus(chargerStatusId: any) {
  //   const url = `${this.apiUrl}/api/v1/connectorStatus/connectorstatusbychargerstatus/${chargerStatusId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getConnectoStatusByChargerStatus(chargerStatusId: any) {
    const token = localStorage.getItem('authToken'); 
    const url = `${this.apiUrl}/api/v1/connectorStatus/connectorstatusbychargerstatus/${chargerStatusId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  

  // Get Connector Status By Real Time Status
  // getConnectoStatusByRealTimeStatus(realTimeStatus: any) {
  //   const url = `${this.apiUrl}/api/v1/connectorStatus/connectorstatusbyrealtimestatus/${realTimeStatus}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getConnectoStatusByRealTimeStatus(realTimeStatus: any) {
    const token = localStorage.getItem('authToken'); 
    const url = `${this.apiUrl}/api/v1/connectorStatus/connectorstatusbyrealtimestatus/${realTimeStatus}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Connector Status By Rated Power
  // getConnectoStatusByRatedPower(ratedPower: any) {
  //   const url = `${this.apiUrl}/api/v1/connectorStatus/connectorstatusbyratedpower/${ratedPower}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getConnectoStatusByRatedPower(ratedPower: any) {
    const token = localStorage.getItem('authToken'); 
    const url = `${this.apiUrl}/api/v1/connectorStatus/connectorstatusbyratedpower/${ratedPower}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Connector Status By Current Power
  // getConnectoStatusByCurrentPower(currentPower: any) {
  //   const url = `${this.apiUrl}/api/v1/connectorStatus/connectorstatusbycurrentpower/${currentPower}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getConnectoStatusByCurrentPower(currentPower: any) {
    const token = localStorage.getItem('authToken'); 
    const url = `${this.apiUrl}/api/v1/connectorStatus/connectorstatusbycurrentpower/${currentPower}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Add Connector Status
  // addConnectorStatus(body: any) {
  //   const url = `${this.apiUrl}/api/v1/connectorStatus/createconnectorstatus`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  addConnectorStatus(body: any) {
    const token = localStorage.getItem('authToken'); 
    const url = `${this.apiUrl}/api/v1/connectorStatus/createconnectorstatus`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }
  

  // Update Connector Status
  // updateConnectorStatus(connectorStatusId: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/connectorStatus/updatechargerstatus/${connectorStatusId}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  updateConnectorStatus(connectorStatusId: any, body: any) {
    const token = localStorage.getItem('authToken'); 
    const url = `${this.apiUrl}/api/v1/connectorStatus/updatechargerstatus/${connectorStatusId}`;
    return this.httpClient.put(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }
  

  // Delete Connector Status
  // deleteConnectorStatus(connectorStatusId: any) {
  //   const url = `${this.apiUrl}/api/v1/connectorStatus/deleteconnectorstatus/${connectorStatusId}`
  //   return this.httpClient.put(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  deleteConnectorStatus(connectorStatusId: any) {
    const token = localStorage.getItem('authToken'); 
    const url = `${this.apiUrl}/api/v1/connectorStatus/deleteconnectorstatus/${connectorStatusId}`;
    return this.httpClient.put(url, {
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
}
