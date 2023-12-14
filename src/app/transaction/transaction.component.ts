import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';
import { TransactionService } from '../services/transaction.service';
import { ManufacturerService } from '../services/manufacturer.service';
import { Manufacturer } from '../models/manufacturer.model';
import { Products } from '../models/products.model';
import { ProductService } from '../services/product.service';
import { Transaction } from '../models/transaction.model';
import { CommonService } from '../services/common.service';
import { ProductCategory } from '../models/productCategory.model';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  transactionForm: FormGroup;
  manufacturers: Manufacturer[];
  products: Products[];
  searchText = '';

  productName: string = 'Select Product Name';
  manufacturerName: string = 'Select Manufacturer';
  noOfUnits: number = 1;
  cost: number = 0;
  weightOfUnit: number = 1;
  productCategory: string = '';
  totalCost: number = 0;

  requestData: Transaction[] = [];
  transactionResponse: Transaction[] = [];
  columnsToDisplay: string[] = ['productName', 'noOfUnits', 'productValue'];

  productCategories: ProductCategory[] = [];
  constructor(private transactionService: TransactionService, private router: Router,
    private tokenStorageService: TokenStorageService, private manufacturerService: ManufacturerService,
    private productService: ProductService, private commonService: CommonService,
    private notificationService: NotificationService) {
  }

  ngOnInit() {
    if (this.tokenStorageService.checkIfUserLoggedIn()) {
      this.manufacturerService.getAllManufacturerData().subscribe((data: Manufacturer[]) => {
        this.manufacturers = data;
      });
      this.loadFormData();
      this.commonService.getProductCategories().subscribe((data: ProductCategory[]) => {
        this.productCategories = data;
      });
      //change the select to different label to proper search functionality.
      //add small detail icon to display info while hovering
      //Add Form Validators
    } else {
      this.tokenStorageService.signOut();
      this.router.navigate(['authz'])
    }
  }

  onManufacturerSelect(event: Event) {
    this.productService.getProductByManufacturerName(this.manufacturerName)
      .subscribe((data: Products[]) => {
        this.products = data;
      });
  }

  loadFormData(): void {
    this.transactionForm = new FormGroup({
      productName: new FormControl('Select Product Name'),
      manufacturerName: new FormControl('Select Manufacturer'),
      noOfUnits: new FormControl(1),
      cost: new FormControl(1),
      weightOfUnit: new FormControl(1),
      totalCost: new FormControl(this.noOfUnits * this.cost),
      productCategory: new FormControl('Select Product Category'),
      phone: new FormControl(''),
      emailAddress: new FormControl('')
    });
  }

  showOrder: boolean = false;
  onSubmit(transactionForm: FormGroup): void {
    //if (this.requestData.length < 5 && this.requestData.length < 6 && this.checkForm() == false) {
    if (this.checkForm() == false) {
      this.addCart();
      this.showOrder = true;
    }
  }

  checkForm(): Boolean {
    if (this.manufacturerName == null || this.manufacturerName == "Select Manufacturer") {
      this.notificationService.showWarning("Select Manufacturer", "Form Data Issue");
      return true;
    }

    if (this.productName == null || this.productName == "Select Product Name") {
      this.notificationService.showWarning("Select Product", "Form Data Issue");
      return true;
    }

    if (this.productCategory == null || this.productCategory == "Select Product Category") {
      this.notificationService.showWarning("Select Product Category", "Form Data Issue");
      return true;
    }

    if (this.noOfUnits == null || this.noOfUnits <= 0
      || this.cost == null || this.cost <= 0
      || this.weightOfUnit == null || this.weightOfUnit <= 0) {
      this.notificationService.showWarning("Enter proper Data", "Form Data Issue");
      return true;
    }
    return false;
  }

  addCart() {
    let existItem = this.requestData.filter(item => item.productName != null
      && item.manufacturerName != null
      && item.productName === this.productName
      && item.manufacturerName === this.manufacturerName);
    if (existItem.length >= 1) {
      existItem[0].productCategoryName = this.productCategory;
      existItem[0].noOfUnits = Number(existItem[0].noOfUnits) + Number(this.noOfUnits);
      existItem[0].unitCost = Number(this.cost);
      existItem[0].weightOfUnit = Number(this.weightOfUnit);
      existItem[0].totalWeight = Number(existItem[0].noOfUnits * existItem[0].weightOfUnit) / 1000;
      existItem[0].productValue = Number(existItem[0].noOfUnits * existItem[0].unitCost);
    } else {
      let data1: Transaction = new Transaction();
      data1.manufacturerName = this.manufacturerName;
      data1.productName = this.productName;
      data1.productCategoryName = this.productCategory;
      data1.noOfUnits = this.noOfUnits;
      data1.unitCost = this.cost;
      data1.weightOfUnit = this.weightOfUnit;
      data1.totalWeight = Number(this.noOfUnits * this.weightOfUnit) / 1000;
      data1.productValue = this.noOfUnits * this.cost;

      this.requestData.push(data1);
    }

    this.updateTotalCost();
    this.transactionForm.reset();
  }

  updateTotalCost() {
    this.totalCost = 0;
    for (let i = 0; i < this.requestData.length; i++) {
      this.totalCost = Number(this.totalCost) + Number(this.requestData[i].productValue);
    }
  }

  updateTotalWeight(index: number) {
    this.requestData[index].totalWeight = (Number(this.requestData[index].noOfUnits) * Number(this.requestData[index].weightOfUnit)) / 1000;
  }

  deleteEntry(event: Event, index: number) {
    if (this.requestData.length <= 1) {
      this.showOrder = false;
      this.totalCost = 0;
      this.requestData = [];
    }
    this.requestData.splice(index, 1);
    this.updateTotalCost();
  }

  addQuantity(event: Event, index: number) {
    this.requestData[index].noOfUnits = Number(this.requestData[index].noOfUnits) + 1;
    this.requestData[index].productValue = Number(this.requestData[index].unitCost) * Number(this.requestData[index].noOfUnits);
    this.updateTotalCost();
    this.updateTotalWeight(index);
  }

  removeQuantity(event: Event, index: number) {
    if (this.requestData[index].noOfUnits <= 1) {
      this.deleteEntry(event, index);
    } else {
      this.requestData[index].noOfUnits = Number(this.requestData[index].noOfUnits) - 1;
      this.requestData[index].productValue = Number(this.requestData[index].unitCost) * Number(this.requestData[index].noOfUnits);
      this.updateTotalCost();
      this.updateTotalWeight(index);
    }
  }

  placeOrder() {
    this.transactionService.placeOrder(this.requestData).subscribe({
      next: (response) => {
        if (response != null || response != undefined) {
          this.transactionResponse = response;
          this.notificationService.showSuccess("Transaction Successfully", "Buy Order Places");
          this.router.navigateByUrl("/products");
        } else {
          this.notificationService.showError("Transaction Failed", "Buy Order Places");
          this.router.navigateByUrl("/dashboard");
        }
      },
      error: (error) => {
        this.notificationService.showError("Transaction Failed", "Buy Order Places");
        this.router.navigateByUrl("/dashboard");
      },
    });
  }
}
