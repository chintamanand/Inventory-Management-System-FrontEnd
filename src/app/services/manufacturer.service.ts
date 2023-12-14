import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Manufacturer } from '../models/manufacturer.model';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {
  length: number;

  constructor(private httpclient: HttpClient, private tokenStorageService: TokenStorageService,
    private router: Router, private notificationService: NotificationService,
    private commonService: CommonService) { }

  manufacturer: Manufacturer = new Manufacturer();

  manufacturers: Observable<Manufacturer[]>;
  baseUrl: string = environment.baseUrl;
  getManfUrl: string = environment.getManfUrl;
  updManfUrl: string = environment.updManfUrl;

  ngOnInit() {
    console.log("Entered Manufacturer Service's ngOnInit() ");
    if (this.tokenStorageService.checkIfUserLoggedIn()) {
      console.log("User Logged In");
    } else {
      console.log("User Logged Out");
      this.tokenStorageService.signOut();
      this.router.navigate(['authz'])
    }
  }

  getAllManufacturerData(): Observable<Manufacturer[]> {
    this.manufacturers = this.httpclient.get<Manufacturer[]>(this.baseUrl + this.getManfUrl);
    if (this.manufacturers == null || this.manufacturers == undefined) {
      this.notificationService.showError("Server Issue - Unable to Load Manufacturer Data", "Data Issue");
      return this.manufacturers;
    } else {
      return this.manufacturers;
    }
  }

  createOrSaveData(form: FormGroup, file: File): Observable<Manufacturer[]> {
    let manufactuerData: Manufacturer = new Manufacturer();
    manufactuerData.manufacturerCompanyName = form.value.manufacturerCompanyName;
    manufactuerData.companyEmailAddress = form.value.companyEmailAddress;
    manufactuerData.dateOfReg = form.value.dateOfReg;
    manufactuerData.regtdAt = form.value.regtdAt;
    manufactuerData.phoneNumber = form.value.phoneNumber;
    manufactuerData.companyGSTIN = form.value.companyGSTIN;
    manufactuerData.street = form.value.street;
    manufactuerData.city = form.value.city;
    manufactuerData.state = form.value.state;
    manufactuerData.country = form.value.country;
    manufactuerData.address = form.value.street + ", " + form.value.city + ", " + form.value.state + ", " + "India";

    if (this.commonService.isEmptyOrNull(form.value.manufacturerCompanyName) ||
      this.commonService.isEmptyOrNull(form.value.companyGSTIN) ||
      this.commonService.isEmptyOrNull(form.value.regtdAt)) {
      this.notificationService.showWarning("Data Issue - companyName/GSTIN/Regd Address", "Form Validation");
      return new Observable<Manufacturer[]>();
    } else {
      let formData: FormData = new FormData();
      formData.append('file', file);
      formData.append('manufacturerDto', JSON.stringify(manufactuerData));
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      this.manufacturers = this.httpclient.post<Manufacturer[]>(this.baseUrl + this.updManfUrl,
        formData, { headers: headers });
      return this.manufacturers;
    }
  }

}
