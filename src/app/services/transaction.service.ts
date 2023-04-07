import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { StockPurchase } from '../models/stockpurchase.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  baseUrl: string = environment.baseUrl;

  stockPurchase: StockPurchase = new StockPurchase();

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

  placeOrder(form: FormGroup): void {
    const stockPurchase1: StockPurchase = new StockPurchase();
    stockPurchase1.productId = form.value.productId;
    stockPurchase1.manufacturerId = form.value.manufacturerId;
    stockPurchase1.noOfUnits = form.value.noOfUnits;
    stockPurchase1.weightOfUnit = form.value.weightOfUnit;
    stockPurchase1.amountPaid = form.value.totalCost;
    stockPurchase1.phoneNumber = form.value.phone;
    stockPurchase1.emailAddress = form.value.emailAddress;
    stockPurchase1.paymentMethod = form.value.dbt;
    stockPurchase1.payeeName = "Test";
    console.log("Stock Purchase Order -- " + JSON.stringify(stockPurchase1));

    this.httpclient.post<StockPurchase>(this.baseUrl + 'stock/placeOrder', stockPurchase1)
      .subscribe({
        next: (response) => {
          this.stockPurchase = response;
        },
        error: (error) => console.log(error),
      });

  }

}
