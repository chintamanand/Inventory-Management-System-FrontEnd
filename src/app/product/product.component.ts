import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductCategory } from '../models/productCategory.model';
import { Products } from '../models/products.model';
import { CommonService } from '../services/common.service';
import { ProductService } from '../services/product.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  dataText1: string = "Product Data";
  myForm: FormGroup;
  products: Products[] = [];
  productCategories: ProductCategory[] = [];

  graphData = new Map<String, number>();
  graphData2 = new Map<String, number>();

  dataPoints2: number[] = [];
  chartLabels: String[] = [];
  chartType = 'pie';

  chartDatasets = [
    { data: this.dataPoints2, label: this.dataText1 }
  ];

  chartColors = [
    {
      backgroundColor: ['#488f31', '#6da046', '#8eb15d', '#adc276', '#cad490', '#e5e6ac', '#fff9ca', '#f7dfa6', '#f1c387', '#eca56d', '#e7855c', '#df6453', '#de425b'],
      borderWidth: 1,
    }
  ];

  chartOptions: any = {
    responsive: true
  };

  chartClicked(event: any): void {
    console.log(event);
  }

  chartHovered(event: any): void {
    console.log(event);
  }

  constructor(private productService: ProductService, private commonService: CommonService,
    private tokenStorageService: TokenStorageService, private router: Router) {
  }

  ngOnInit() {
    console.log("Entered Product ngOnInit() ");

    if (this.tokenStorageService.checkIfUserLoggedIn()) {
      console.log("User Logged In");
      this.loadFormData();
      this.loadPageData();
    } else {
      console.log("User Logged Out");
      this.tokenStorageService.signOut();
      this.router.navigate(['authz'])
    }
  }

  loadFormData(): void {
    this.myForm = new FormGroup({
      productId: new FormControl(''),
      manufacturerId: new FormControl(''),
      productName: new FormControl(''),
      productCategory: new FormControl(''),
      noOfUnits: new FormControl(''),
      weightOfUnit: new FormControl(''),
      unitCost: new FormControl(''),
      landedCost: new FormControl(''),
      productReceived: new FormControl(''),
      productLocation: new FormControl('')
    });

  }

  loadPageData(): void {
    this.productService.getAllProductData().subscribe((data: Products[]) => {
      this.products = data;
      this.updateGraphData(this.products);
    });

    this.commonService.getProductCategories().subscribe((data: ProductCategory[]) => {
      this.productCategories = data;
    });
  }

  updateGraphData(product: Products[]): void {
    for (var i = 0; i < product.length; i++) {
      if (this.graphData.has(product[i].productCategory)) {
        var count = this.graphData.get(product[i].productCategory);
        if (count !== undefined) {
          this.graphData.set(product[i].productCategory, count + 1);
        }
      } else {
        this.graphData.set(product[i].productCategory, 1);
      }
    }

    for (let key of this.graphData.keys()) {
      var count = this.graphData.get(key);
      if (count !== undefined) {
        this.graphData2.set(key, (count / this.products.length) * 100);
      }
    }

    this.dataPoints2 = Array.from(this.graphData2.values());
    this.chartDatasets = [
      { data: this.dataPoints2, label: this.dataText1 }
    ];
    this.chartLabels = Array.from(this.graphData2.keys());
  }

  onSubmit(form: FormGroup): void {
    this.productService.createOrSaveData(form);
    // navigate to view after successfully save..
    // create/get  product category information from  fixed table..
    // transaction -> two option --  Purchase(Stock Purchase, Payment, Invoice and Email Generation, Daily report) & Sale(Sale of Stock)
  }

  exportData(filename: string = 'product_data.xlsx'): void {
    this.commonService.getExport("product").subscribe(
      (response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        if (filename)
          downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      }
    )
  }

}
