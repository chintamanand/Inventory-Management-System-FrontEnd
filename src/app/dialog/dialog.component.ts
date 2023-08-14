import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Products } from '../models/products.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  myForm: FormGroup;

  ngOnInit(): void {
  }
  
  productData: Products;
  constructor(private notificationService: NotificationService,
    public dialogRef: MatDialogRef<DialogComponent>, private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: Products, private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      productId: [{ value: data.productId, disabled: true}, Validators.required],
      manufacturerId: data.manufacturerId,
      productName: [data.productName, Validators.required],
      productCategory: [{ value: data.productCategory, disabled: true}, Validators.required],
      noOfUnits: [data.noOfUnits],
      weightOfUnit: [data.weightOfUnit],
      unitCost: [data.unitCost],
      landedCost: [data.landedCost],
      productReceived: [data.productReceived],
      productLocation: [data.productLocation]
    });
   this.productData=data;
  }

  onSubmit(formData: FormGroup) {
    formData.value.productId  = this.productData.productId;
    formData.value.productCategory = this.productData.productCategory;
    console.log("Form Data is -- " + JSON.stringify(formData.value));
    this.productService.createOrSaveData(formData).subscribe({
      next: (response) => {
        if (response != null || response != undefined) {          
          this.myForm.reset();
          this.dialogRef.close(response);
          this.notificationService.showSuccess("Product Record was created Successfully", "Product Data");
        } else {
          this.notificationService.showError("Record was not created", "Data Issue");
        }
      },
      error: (error) => {
        this.notificationService.showError(error.error.message, "Data Issue");
      },
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
