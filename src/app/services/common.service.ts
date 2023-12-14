import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { State } from '../models/state.model';
import { City } from '../models/city.model';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ProductCategory } from '../models/productCategory.model';
import { NotificationService } from './notification.service';
import { OverviewResponse } from '../models/OverviewResponse.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  state: State = new State();

  constructor(private httpclient: HttpClient, private notificationService: NotificationService) { }

  statesList: State[] = [];

  states: Observable<State[]>;

  cities: Observable<City[]>;

  baseUrl: string = environment.baseUrl;
  getStateUrl: string = environment.getStateUrl;
  getCitiesUrl: string = environment.getCitiesUrl;
  getCatgUrl: string = environment.getCatgUrl;
  genXcelUrl: string = environment.genXcelUrl;
  getOverviewUrl: string = environment.getOverviewUrl;

  getAllStates(countryName: string): Observable<State[]> {
    this.states = this.httpclient.get<State[]>(this.baseUrl + this.getStateUrl + '?countryName=' + countryName);
    if (this.states == null || this.states == undefined) {
      this.notificationService.showError("Server Issue - Unable to Load State Data", "Data Issue");
      return this.states;
    } else {
      return this.states;
    }
  }

  getAllCities(stateName: string): Observable<City[]> {
    this.cities = this.httpclient.get<City[]>(this.baseUrl + this.getCitiesUrl + '?stateName=' + stateName);
    return this.cities;
  }

  getExport(dataType: string): Observable<Blob> {
    const headers = new HttpHeaders().set("Access-Control-Allow-Origin", '*');
    return this.httpclient.get(this.baseUrl + this.genXcelUrl + dataType, { headers, responseType: 'blob' });
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpclient.get<ProductCategory[]>(this.baseUrl + this.getCatgUrl);
  }

  isEmptyOrNull(value: any): Boolean {
    if (value == '' || value == null || value == undefined) {
      return true;
    } else {
      return false;
    }
  }

  getOverviewData(): Observable<OverviewResponse> {
    return this.httpclient.get<OverviewResponse>(this.baseUrl + this.getOverviewUrl);
  }

}
