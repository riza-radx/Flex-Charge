import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectorService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All Connectors
  // getAllConnectors() {
  //   const url = `${this.apiUrl}/api/v1/connector/allconnectors`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }
  getAllConnectors() {
    const token = localStorage.getItem('authToken'); // Get token from localStorage or another source
    const url = `${this.apiUrl}/api/v1/connector/allconnectors`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Add Authorization header
    }).pipe(catchError(this.errorHandler));
  }

  // Get Connector
  // getConnector(connectorId: any) {
  //   const url = `${this.apiUrl}/api/v1/connector/getconnectorbyid/${connectorId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getConnector(connectorId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/connector/getconnectorbyid/${connectorId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Connector By Number
  // getConnectorByNumber(number: any) {
  //   const url = `${this.apiUrl}/api/v1/connector/getconnectorbynumber/${number}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getConnectorByNumber(number: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/connector/getconnectorbynumber/${number}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }


  // Get Connector By Name
  // getConnectorByName(name: any) {
  //   const url = `${this.apiUrl}/api/v1/connector/getconnectorbyname/${name}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getConnectorByName(name: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/connector/getconnectorbyname/${name}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Connector By Rated Power
  // getConnectorByRatedPower(ratedPower: any) {
  //   const url = `${this.apiUrl}/api/v1/connector/getconnectorbyratedpower/${ratedPower}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getConnectorByRatedPower(ratedPower: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/connector/getconnectorbyratedpower/${ratedPower}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // // Get Connector By Standard
  // getConnectorByStandard(standard: any) {
  //   const url = `${this.apiUrl}/api/v1/connector/getconnectorbystandard/${standard}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getConnectorByStandard(standard: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/connector/getconnectorbystandard/${standard}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // // Get Connector By Validity
  // getConnectorByValidity(validity: any) {
  //   const url = `${this.apiUrl}/api/v1/connector/getconnectorbyvalidity/${validity}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getConnectorByValidity(validity: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/connector/getconnectorbyvalidity/${validity}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Connector By Status
  // getConnectorByStatus(status: any) {
  //   const url = `${this.apiUrl}/api/v1/connector/getconnectorbystatus/${status}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getConnectorByStatus(status: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/connector/getconnectorbystatus/${status}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Connector By Charger
  // getConnectorByCharger(charger: any) {
  //   const url = `${this.apiUrl}/api/v1/connector/getconnectorbycharger/${charger}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getConnectorByCharger(charger: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/connector/getconnectorbycharger/${charger}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // // Add Connector
  // addConnector(body: any) {
  //   const url = `${this.apiUrl}/api/v1/connector/addconnector`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Update Connector
  // updateConnector(connectorId: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/connector/updateconnector/${connectorId}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // // Delete Connector
  // deleteConnector(connectorId: any) {
  //   const url = `${this.apiUrl}/api/v1/connector/deleteconnector/${connectorId}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }

  // Add Connector
  addConnector(body: any): Observable<{ success: boolean; message: string }> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/connector/addconnector`;

    return this.httpClient.post<{ success: boolean; message: string }>(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Update Connector
  updateConnector(connectorId: any, body: any): Observable<{ success: boolean; message: string }> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/connector/updateconnector/${connectorId}`;

    return this.httpClient.put<{ success: boolean; message: string }>(url, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Delete Connector
  deleteConnector(connectorId: any): Observable<{ success: boolean; message: string }> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/connector/deleteconnector/${connectorId}`;

    return this.httpClient.delete<{ success: boolean; message: string }>(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }


  errorHandler(httpErrorResponse: HttpErrorResponse) {
    return new Observable((observer: Observer<any>) => {
      observer.error(httpErrorResponse);
    })
  }
}
