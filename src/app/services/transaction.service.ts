import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Transaction } from '../models/transaction.model';
import { TokenStorageService } from './token-storage.service';
import { OrderRequest } from '../models/OrderRequest.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  baseUrl: string = environment.baseUrl;

  transactionResponse: Observable<Transaction[]>;

  constructor(private httpclient: HttpClient, private router: Router,
    private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    console.log("Entered Transaction's Service ngOnInit() ");

    if (this.tokenStorageService.checkIfUserLoggedIn()) {
      console.log("User Logged In");
    } else {
      console.log("User Logged Out");
      this.tokenStorageService.signOut();
      this.router.navigate(['authz'])
    }
  }

  placeOrder(requestData: Transaction[]): Observable<Transaction[]> {
    const orderRequest: OrderRequest = new OrderRequest();
    orderRequest.orderDetails = requestData;

    this.transactionResponse = this.httpclient.post<Transaction[]>(this.baseUrl + 'stock/buy', orderRequest);
    if (this.transactionResponse == null || this.transactionResponse == undefined) {
      return this.transactionResponse;
    } else {
      return this.transactionResponse;
    }
  }

}
