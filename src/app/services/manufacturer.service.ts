import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Manufacturer } from '../models/manufacturer.model';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {
  length: number;

  constructor(private httpclient: HttpClient, private tokenStorageService: TokenStorageService,
    private router: Router) { }

  manufacturer: Manufacturer = new Manufacturer();

  manufacturers: Observable<Manufacturer[]>;

  baseUrl: string = environment.baseUrl;
  getManfUrl: string = environment.getManfUrl;
  updManfUrl: string = environment.updManfUrl;

  ngOnInit() {
    console.log("Entered Manufacturer's Service ngOnInit() ");

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
    return this.manufacturers;
  }

  createAuthorizationHeader(headers: HttpHeaders) {
    headers.append("Authorization", "Bearer " + this.tokenStorageService.getToken);
  }

  createOrSaveData(form: FormGroup): void {
    const manufactuerData: Manufacturer = new Manufacturer();
    manufactuerData.manufacturerId = form.value.manufacturerId;
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

    this.httpclient.post<Manufacturer>(this.baseUrl + this.updManfUrl, manufactuerData)
      .subscribe({
        next: (response) => {
          this.manufacturer = response;
          window.location.reload();
        },
        error: (error) => console.log(error),
      });
  }

}
