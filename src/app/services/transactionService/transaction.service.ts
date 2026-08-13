import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, Observer } from "rxjs";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  // private apiUrl = "https://api.radx.app";
  // private apiUrl = "https://localhost:3001";
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // Get All Transactions
  // getAllTransactions() {
  //   const url = `${this.apiUrl}/api/v1/transaction/alltransactions`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   }).pipe(catchError(this.errorHandler))
  // }
  getAllTransactions() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/transaction/alltransactions`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Transaction
  // getTransaction(id: any) {
  //   const url = `${this.apiUrl}/api/v1/transaction/singletransaction/${id}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getTransaction(id: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/transaction/singletransaction/${id}`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Transaction By Card
  // getTransactionByCard(cardId: any) {
  //   const url = `${this.apiUrl}/api/v1/transaction/cardtransaction/${cardId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getTransactionByCard(cardId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/transaction/cardtransaction/${cardId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Transaction By Charger
  // getTransactionByCharger(chargerId: any) {
  //   const url = `${this.apiUrl}/api/v1/transaction/chargertransaction/${chargerId}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
  getTransactionByCharger(chargerId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/transaction/chargertransaction/${chargerId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // Get Transaction By Type
  // getTransactionByType(type: any) {
  //   const url = `${this.apiUrl}/api/v1/transaction/typetransaction/${type}`
  //   return this.httpClient.get(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }

  getTransactionByType(type: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/transaction/typetransaction/${type}`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

   getTransactionByUserGroup(usergrId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/transaction/user-group/${usergrId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }

  // 🔹 Merr transaksionet për një User (receiver)
  getTransactionByUser(userId: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/transaction/user/${userId}`;
    return this.httpClient.get(url, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(catchError(this.errorHandler));
  }
  // Add Transaction
  // addTransaction(body: any) {
  //   const url = `${this.apiUrl}/api/v1/transaction/addtransaction`
  //   return this.httpClient.post(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  addTransaction(body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/transaction/addtransaction`;
    return this.httpClient.post(url, body, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }

  // Update Transaction
  // updateTransaction(id: any, body: any) {
  //   const url = `${this.apiUrl}/api/v1/transaction/updatetransaction/${id}`
  //   return this.httpClient.put(url, body, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  updateTransaction(id: any, body: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/transaction/updatetransaction/${id}`;
    return this.httpClient.put(url, body, {
      observe: 'body',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    });
  }

  // Delete Transaction
  // deleteTransaction(id: any) {
  //   const url = `${this.apiUrl}/api/v1/transaction/deletetransaction/${id}`
  //   return this.httpClient.delete(url, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  // }
  deleteTransaction(id: any) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/api/v1/transaction/deletetransaction/${id}`;
    return this.httpClient.delete(url, {
      observe: 'body',
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
