import { Component, OnInit, Inject } from '@angular/core';
import { Manufacturer } from '../models/manufacturer.model';
import { ManufacturerService } from '../services/manufacturer.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manufacturer-view-dialog',
  templateUrl: './manufacturer-view-dialog.component.html',
  styleUrls: ['./manufacturer-view-dialog.component.css']
})
export class ManufactureViewDialogComponent implements OnInit {

  myForm: FormGroup;

  ngOnInit(): void {
  }

  manufacturerData: Manufacturer;
  constructor(public dialogRef: MatDialogRef<ManufactureViewDialogComponent>, private manufacturerService: ManufacturerService,
    @Inject(MAT_DIALOG_DATA) public data: Manufacturer, private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      manufacturerId: data.manufacturerId,
      manufacturerCompany: [data.manufacturerCompanyName, Validators.required],
      companyEmailAddress: [data.companyEmailAddress],
      phoneNumber: [data.phoneNumber],
      country: [data.country],
      companyGSTIN: [data.companyGSTIN],
      fileId: [data.fileId]
    });
    this.manufacturerData = data;
  }

  closeDialog() {
    this.myForm.reset();
    this.dialogRef.close();
  }
  
}
