import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Products } from '../models/products.model';
import { TokenStorageService } from './token-storage.service';
import { CommonService } from './common.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  length: number;

  constructor(private httpclient: HttpClient, private tokenStorageService: TokenStorageService,
    private router: Router, private commonService: CommonService,
    private notificationService: NotificationService) { }

  product: Products = new Products();

  products: Observable<Products[]>;

  baseUrl: string = environment.baseUrl;
  getPrdUrl: string = environment.getPrdUrl;
  updPrdUrl: string = environment.updPrdUrl;

  ngOnInit() {
    console.log("Entered Product's Service ngOnInit() ");
    if (this.tokenStorageService.checkIfUserLoggedIn()) {
      console.log("User Logged In");
    } else {
      console.log("User Logged Out");
      this.tokenStorageService.signOut();
      this.router.navigate(['authz'])
    }
  }

  getAllProductData(): Observable<Products[]> {
    this.products = this.httpclient.get<Products[]>(this.baseUrl + this.getPrdUrl);
    if (this.products == null || this.products == undefined) {
      this.notificationService.showError("Server Issue - Unable to Load Product Data", "Data Issue");
      return this.products;
    } else {
      return this.products;
    }
  }

  createOrSaveData(form: FormGroup): Observable<Products[]> {
    const productData: Products = new Products();
    productData.productId = form.value.productId;
    productData.manufacturerId = form.value.manufacturerId;
    productData.productName = form.value.productName;
    productData.productCategory = form.value.productCategory;
    productData.productDesc = form.value.productCategory;
    productData.noOfUnits = form.value.noOfUnits;
    productData.weightOfUnit = form.value.weightOfUnit;
    productData.unitCost = form.value.unitCost;
    productData.landedCost = form.value.landedCost;
    productData.productReceived = form.value.productReceived;
    productData.productLocation = form.value.productLocation;

    if (this.commonService.isEmptyOrNull(form.value.manufacturerId)
      || this.commonService.isEmptyOrNull(form.value.productName)
      || this.commonService.isEmptyOrNull(form.value.productCategory)) {
      this.notificationService.showWarning("Data Issue - Name/Manufacturer Id/Category", "Form Validation");
      return new Observable<Products[]>();
    } else {
      this.products = this.httpclient.post<Products[]>(this.baseUrl + this.updPrdUrl, productData);
      return this.products;
    }
  }

}
