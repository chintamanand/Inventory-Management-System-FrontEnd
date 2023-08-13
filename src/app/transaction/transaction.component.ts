import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  transactionForm: FormGroup;
  noOfUnits: number = 1;
  totalCost: number = 1;

  constructor(private transactionService: TransactionService, private router: Router,
              private tokenStorageService: TokenStorageService) {}

  ngOnInit() {
    console.log("Entered Transaction ngOnInit() ");
    if (this.tokenStorageService.checkIfUserLoggedIn()) {
      this.loadFormData();
    } else {
      this.tokenStorageService.signOut();
      this.router.navigate(['authz'])
    }
  }

  loadFormData(): void {
    this.transactionForm = new FormGroup({
      productId: new FormControl(''),
      manufacturerId: new FormControl(''),
      noOfUnits: new FormControl(''),
      weightOfUnit: new FormControl(''),
      totalCost: new FormControl(''),
      dbt: new FormControl(''),
      phone: new FormControl(''),
      emailAddress: new FormControl('')
    });
  }

  onSubmit(transactionForm: FormGroup): void {
    this.noOfUnits = transactionForm.value.noOfUnits;
    this.totalCost = transactionForm.value.totalCost;

    this.transactionService.placeOrder(transactionForm);
  }

}
