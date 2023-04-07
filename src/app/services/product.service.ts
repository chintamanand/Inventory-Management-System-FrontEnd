import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Products } from '../models/products.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  length: number;

  constructor(private httpclient: HttpClient, private tokenStorageService: TokenStorageService,
              private router: Router) { }

  product: Products = new Products();

  products: Observable<Products[]>;

  baseUrl: string = environment.baseUrl;

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
    this.products = this.httpclient.get<Products[]>(this.baseUrl + 'products/get');
    return this.products;
  }

  createOrSaveData(form: FormGroup): void {
    console.log("Product Form Data -- " + form.value);
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

    console.log(JSON.stringify(productData));

    this.httpclient.post<Products>(this.baseUrl + 'products/create-update', productData)
      .subscribe({
        next: (response) => {
          this.product = response;
          window.location.reload();
        },
        error: (error) => console.log(error),
      });

  }

}
