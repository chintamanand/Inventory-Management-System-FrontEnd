import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductCategory } from '../models/productCategory.model';
import { Products } from '../models/products.model';
import { CommonService } from '../services/common.service';
import { ProductService } from '../services/product.service';
import { TokenStorageService } from '../services/token-storage.service';
import { MatTable } from '@angular/material/table';
import { NotificationService } from '../services/notification.service';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  dataText: string = "Product Data";
  myForm: FormGroup;
  products: Products[] = [];
  productCategories: ProductCategory[] = [];

  graphData = new Map<String, number>();
  graphData2 = new Map<String, number>();

  dataPoints2: number[] = [];
  chartLabels: String[] = [];
  chartType = 'pie';

  columnsToDisplay: string[] = ['productId', 'productName', 'productCategory', 'manufacturerName', 'totalWeightOfUnits', 'totalCost', 'totalProductValue', 'productLocation'];
  @ViewChild('prdctTable') matTable: MatTable<Element>;
  chartDatasets = [
    { data: this.dataPoints2, label: this.dataText}
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
  }

  chartHovered(event: any): void {
  }

  constructor(private productService: ProductService, private commonService: CommonService,
    private tokenStorageService: TokenStorageService, private router: Router,
    private notificationService: NotificationService, private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      productId: [null],
      manufacturerId: [null, [Validators.required]],
      productName: [null, Validators.required],
      productCategory: [null, Validators.required],
      noOfUnits: [null],
      weightOfUnit: [null],
      unitCost: [null],
      landedCost: [null],
      productReceived: [null],
      productLocation: [null]
    });
  }

  ngOnInit() {
    console.log("Entered Product ngOnInit() ");
    if (this.tokenStorageService.checkIfUserLoggedIn()) {
      console.log("User Logged In");
      this.loadPageData();
    } else {
      console.log("User Logged Out");
      this.tokenStorageService.signOut();
      this.router.navigate(['authz'])
    }
  }

  loadPageData(): void {
    this.productService.getAllProductData().subscribe((data: Products[]) => {
      this.products = data;
      this.updateGraphData(this.products);
      this.matTable.renderRows();
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
      { data: this.dataPoints2, label: this.dataText }
    ];
    this.chartLabels = Array.from(this.graphData2.keys());
  }

  onSubmit(formData: FormGroup): void {
    this.productService.createOrSaveData(formData).subscribe({
      next: (response) => {
        if (response != null || response != undefined) {
          this.products = response;
          this.updateGraphData(this.products);
          this.matTable.renderRows();
          this.myForm.reset();
          this.notificationService.showSuccess("Product Record was created Successfully", "Product Data");
        } else {
          this.notificationService.showError("Record was not created", "Data Issue");
          return null;
        }
      },
      error: (error) => {
        this.notificationService.showError(error.error.message, "Data Issue");
        return null;
      },
    });
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
