import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ChargingHistoryService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;
  
  constructor(private httpClient: HttpClient) { }


  // Get All Chargings
  // getAllChargings(filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/allcharging`
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
  getAllChargings(filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/allcharging`;
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
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get All Chargings
  // getAllDashboardChargings(filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/alldashboardcharging`
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
  getAllDashboardChargings(filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/alldashboardcharging`;
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
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Charging
  // getCharging(chargingHistoryId: any) {
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbyid/${chargingHistoryId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getCharging(chargingHistoryId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbyid/${chargingHistoryId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get All Charging
  // getAllCharging(chargingHistoryId: any) {
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/getallchargingbyid/${chargingHistoryId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getAllCharging(chargingHistoryId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/getallchargingbyid/${chargingHistoryId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }


  // Get Charging By Charger
  // getChargingByCharger(chargerId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbycharger/${chargerId}`
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

  getChargingByCharger(chargerId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbycharger/${chargerId}`;
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
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }
  // Get Charging By Connector
  // getChargingByConnector(connectorId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbyconnector/${connectorId}`
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
  getChargingByConnector(connectorId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbyconnector/${connectorId}`;
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
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Charging By Card
  // getChargingByCard(cardId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbycard/${cardId}`
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
  getChargingByCard(cardId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbycard/${cardId}`;
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
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Charging By Company
  // getChargingByCompany(companyId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbycompany/${companyId}`
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
  getChargingByCompany(companyId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbycompany/${companyId}`;
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
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Charging By Partner
  // getChargingByPartner(partnerId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbypartner/${partnerId}`
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
  getChargingByPartner(partnerId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbypartner/${partnerId}`;
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
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Charging By User Group
  // getChargingByUserGroup(userGroupId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbyusergroup/${userGroupId}`
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
  getChargingByUserGroup(userGroupId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbyusergroup/${userGroupId}`;
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
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Charging By User
  // getChargingByUser(userId: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbyuser/${userId}`
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
  getChargingByUser(userId: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbyuser/${userId}`;
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
        .append('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }
  // Get Charging By Current User
  // getChargingByCurrentUser(filters: any = {}) {
  //   const token = localStorage.getItem('authToken');
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbycurrentuser`
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
  //     // headers: new HttpHeaders().append('Content-Type', 'application/json')
  //     headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByCurrentUser(filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbycurrentuser`;
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
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Charging By Started Type
  // getChargingByStartedType(startedType: any, filters: any = {}) {
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbystartedtype/${startedType}`
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
  getChargingByStartedType(startedType: any, filters: any = {}) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbystartedtype/${startedType}`;
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
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Charging By Started Time
  // getChargingByStartedTime(strtedTime: any) {
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbystartedtime/${strtedTime}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByStartedTime(strtedTime: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbystartedtime/${strtedTime}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // // Get Charging By Energy
  // getChargingByEnergy(energy: any) {
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbyenergy/${energy}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByEnergy(energy: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbyenergy/${energy}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Charging By Cost
  // getChargingByCost(cost: any) {
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbycost/${cost}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByCost(cost: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbycost/${cost}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Charging By Rated Per Days
  // getChargingByRatePerDays(ratePerDays: any) {
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbyrateperdays/${ratePerDays}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByRatePerDays(ratePerDays: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbyrateperdays/${ratePerDays}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Charging By Current
  // getChargingByCurrent(current: any) {
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbycurrent/${current}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByCurrent(current: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbycurrent/${current}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Charging By Voltage
  // getChargingByVoltage(voltage: any) {
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbyvoltage/${voltage}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByVoltage(voltage: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbyvoltage/${voltage}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // Get Charging By Power
  // getChargingByPower(power: any) {
  //   const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbypower/${power}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getChargingByPower(power: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/chargingHistory/getchargingbypower/${power}`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    })
      .pipe(catchError(this.errorHandler));
  }

  // ===========================================================================
  // 🆕 DEDICATED MONTH-SCOPED ENDPOINTS (lean payload, fast)
  // ===========================================================================
  // Per Charging History screen — perdor keto ne vend te `getAllChargings` /
  // `getChargingByCompany` / etj. Backend ben WHERE strikt per muajin e zgjedhur
  // dhe kthen vetem kolonat qe tabela perdor.
  //
  // year: number (psh 2026); month: number 1..12.
  // filters: e njejta forma si me pare (started_type, company_id, partner_id, ...)
  //          — month/year nuk duhet te perfshihen ne filters.

  private buildMonthHeaders() {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }

  private buildMonthParams(filters: any) {
    let params = new HttpParams();
    for (const key in filters) {
      if (filters.hasOwnProperty(key) && filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
        if (key === 'month' || key === 'year') continue;   // jane ne URL
        params = params.set(key, filters[key]);
      }
    }
    return params;
  }

  getChargingByMonthAll(year: number, month: number, filters: any = {}) {
    const url = `${this.apiUrl}/api/v1/chargingHistory/bymonth/all/${year}/${month}`;
    return this.httpClient.get(url, {
      observe: 'body',
      params: this.buildMonthParams(filters),
      withCredentials: true,
      headers: this.buildMonthHeaders(),
    }).pipe(catchError(this.errorHandler));
  }

  getChargingByMonthForCompany(companyId: number | string, year: number, month: number, filters: any = {}) {
    const url = `${this.apiUrl}/api/v1/chargingHistory/bymonth/company/${companyId}/${year}/${month}`;
    return this.httpClient.get(url, {
      observe: 'body',
      params: this.buildMonthParams(filters),
      withCredentials: true,
      headers: this.buildMonthHeaders(),
    }).pipe(catchError(this.errorHandler));
  }

  getChargingByMonthForPartner(partnerId: number | string, year: number, month: number, filters: any = {}) {
    const url = `${this.apiUrl}/api/v1/chargingHistory/bymonth/partner/${partnerId}/${year}/${month}`;
    return this.httpClient.get(url, {
      observe: 'body',
      params: this.buildMonthParams(filters),
      withCredentials: true,
      headers: this.buildMonthHeaders(),
    }).pipe(catchError(this.errorHandler));
  }

  getChargingByMonthForUserGroup(userGroupId: number | string, year: number, month: number, filters: any = {}) {
    const url = `${this.apiUrl}/api/v1/chargingHistory/bymonth/usergroup/${userGroupId}/${year}/${month}`;
    return this.httpClient.get(url, {
      observe: 'body',
      params: this.buildMonthParams(filters),
      withCredentials: true,
      headers: this.buildMonthHeaders(),
    }).pipe(catchError(this.errorHandler));
  }

  getChargingByMonthForCurrentUser(year: number, month: number, filters: any = {}) {
    const url = `${this.apiUrl}/api/v1/chargingHistory/bymonth/currentuser/${year}/${month}`;
    return this.httpClient.get(url, {
      observe: 'body',
      params: this.buildMonthParams(filters),
      withCredentials: true,
      headers: this.buildMonthHeaders(),
    }).pipe(catchError(this.errorHandler));
  }

  // 🆕 Energy Report per nje charger — Charger Details tab "Energy Report".
  // Query params:
  //   - date=YYYY-MM-DD   → total per nje dite
  //   - year=YYYY & month=1..12 → total i muajit + ndarje dite-per-dite
  // Response: { success, total, breakdown: [{ date, total_energy }] }
  getChargerEnergySummary(chargerId: number | string, params: { year?: number; month?: number; date?: string } = {}) {
    const url = `${this.apiUrl}/api/v1/chargingHistory/charger/${chargerId}/energy-summary`;
    let httpParams = new HttpParams();
    if (params.date) {
      httpParams = httpParams.set('date', params.date);
    } else {
      if (params.year != null) httpParams = httpParams.set('year', String(params.year));
      if (params.month != null) httpParams = httpParams.set('month', String(params.month));
    }
    return this.httpClient.get(url, {
      observe: 'body',
      params: httpParams,
      withCredentials: true,
      headers: this.buildMonthHeaders(),
    }).pipe(catchError(this.errorHandler));
  }

  // 🆕 Global Energy Report — per te gjithe chargers (me filtra opsionale).
  // Response: { success, total, totalSessions, breakdown[], byCharger[] }
  getGlobalEnergySummary(params: {
    year?: number;
    month?: number;
    date?: string;
    charger_id?: number | null;
    company_id?: number | null;
  } = {}) {
    const url = `${this.apiUrl}/api/v1/chargingHistory/energy-summary-global`;
    let httpParams = new HttpParams();
    if (params.date) {
      httpParams = httpParams.set('date', params.date);
    } else {
      if (params.year != null) httpParams = httpParams.set('year', String(params.year));
      if (params.month != null) httpParams = httpParams.set('month', String(params.month));
    }
    if (params.charger_id) httpParams = httpParams.set('charger_id', String(params.charger_id));
    if (params.company_id) httpParams = httpParams.set('company_id', String(params.company_id));
    return this.httpClient.get(url, {
      observe: 'body',
      params: httpParams,
      withCredentials: true,
      headers: this.buildMonthHeaders(),
    }).pipe(catchError(this.errorHandler));
  }

  // 🆕 GET listen e ID-ve qe jane ne pending_fiscal_invoices.
  // Perdoret per te fshehur buton Retry — cron i automatik do trajtoje keto.
  // Response: { chargingHistoryIds: number[], rechargeIds: number[] }
  getPendingFiscalIds() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/retryInvoice/pending`;
    return this.httpClient.get(url, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // 🆕 Retry BC invoice creation per nje sesion karikimi ose rimbushje.
  // Backend: POST /api/v1/retryInvoice  Body: { type, id }
  // Akses: vetem COMPANY_ANALYST + admin role-t. Backend kthen { success, invoiceNumber, message }.
  retryBCInvoice(type: 'charging' | 'recharge', id: number | string) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/retryInvoice`;
    return this.httpClient.post(url, { type, id }, {
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
