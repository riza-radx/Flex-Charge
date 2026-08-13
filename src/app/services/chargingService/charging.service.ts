import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ChargingService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;
  
  constructor(private httpClient: HttpClient) { }

  // Get All Chargings
  // getAllChargings() {
  //   const url = `${this.apiUrl}/api/v1/charging/allcharging`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }
  getAllChargings() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charging/allcharging`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charging
  // getCharging(chargingId: any) {
  //   const url = `${this.apiUrl}/api/v1/charging/getchargingbyid/${chargingId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getCharging(chargingId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charging/getchargingbyid/${chargingId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }


  // Get Charging By Charger
  // getChargingByCharger(chargerId: any) {
  //   const url = `${this.apiUrl}/api/v1/charging/getchargingbycharger/${chargerId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByCharger(chargerId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charging/getchargingbycharger/${chargerId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charging By Connector
  // getChargingByConnector(connectorId: any) {
  //   const url = `${this.apiUrl}/api/v1/charging/getchargingbyconnector/${connectorId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getChargingByConnector(connectorId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charging/getchargingbyconnector/${connectorId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  // Get Charging By Card
  // getChargingByCard(cardId: any) {
  //   const url = `${this.apiUrl}/api/v1/charging/getchargingbycard/${cardId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByCard(cardId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charging/getchargingbycard/${cardId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charging By Started Type
  // getChargingByStartedType(startedType: any) {
  //   const url = `${this.apiUrl}/api/v1/charging/getchargingbystartedtype/${startedType}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByStartedType(startedType: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charging/getchargingbystartedtype/${startedType}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charging By Started Time
  // getChargingByStartedTime(strtedTime: any) {
  //   const url = `${this.apiUrl}/api/v1/charging/getchargingbystartedtime/${strtedTime}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByStartedTime(strtedTime: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charging/getchargingbystartedtime/${strtedTime}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charging By Energy
  // getChargingByEnergy(energy: any) {
  //   const url = `${this.apiUrl}/api/v1/charging/getchargingbyenergy/${energy}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByEnergy(energy: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charging/getchargingbyenergy/${energy}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charging By Cost
  // getChargingByCost(cost: any) {
  //   const url = `${this.apiUrl}/api/v1/charging/getchargingbycost/${cost}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByCost(cost: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charging/getchargingbycost/${cost}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charging By Rated Per Days
  // getChargingByRatePerDays(ratePerDays: any) {
  //   const url = `${this.apiUrl}/api/v1/charging/getchargingbyrateperdays/${ratePerDays}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByRatePerDays(ratePerDays: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charging/getchargingbyrateperdays/${ratePerDays}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charging By Current
  // getChargingByCurrent(current: any) {
  //   const url = `${this.apiUrl}/api/v1/charging/getchargingbycurrent/${current}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByCurrent(current: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charging/getchargingbycurrent/${current}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charging By Voltage
  // getChargingByVoltage(voltage: any) {
  //   const url = `${this.apiUrl}/api/v1/charging/getchargingbyvoltage/${voltage}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByVoltage(voltage: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charging/getchargingbyvoltage/${voltage}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charging By Power
  // getChargingByPower(power: any) {
  //   const url = `${this.apiUrl}/api/v1/charging/getchargingbypower/${power}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByPower(power: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charging/getchargingbypower/${power}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charging By Company
  // getChargingByCompany(companyId: any) {
  //   const url = `${this.apiUrl}/api/v1/charging/getchargingbycompany/${companyId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByCompany(companyId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charging/getchargingbycompany/${companyId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charging By Partner
  // getChargingByPartner(partnerId: any) {
  //   const url = `${this.apiUrl}/api/v1/charging/getchargingbypartner/${partnerId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByPartner(partnerId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charging/getchargingbypartner/${partnerId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  // Get Charging By User Group
  // getChargingByUserGroup(userGroupId: any) {
  //   const url = `${this.apiUrl}/api/v1/charging/getchargingbyusergroup/${userGroupId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByUserGroup(userGroupId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charging/getchargingbyusergroup/${userGroupId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charging By User
  // getChargingByUser(userId: any) {
  //   const url = `${this.apiUrl}/api/v1/charging/getchargingbyuser/${userId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByUser(userId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/charging/getchargingbyuser/${userId}`;
    return this.httpClient.get(url, {
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
