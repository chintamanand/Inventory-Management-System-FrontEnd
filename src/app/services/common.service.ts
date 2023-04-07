import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { State } from '../models/state.model';
import { City } from '../models/city.model';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ProductCategory } from '../models/productCategory.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  state: State = new State();

  constructor(private httpclient: HttpClient) { }

  statesList: State[] = [];

  states: Observable<State[]>;
  
  cities: Observable<City[]>;

  baseUrl:string = environment.baseUrl;

  getAllStates(countryName: string): Observable<State[]> {
    this.states = this.httpclient.get<State[]>(this.baseUrl + 'data/getStates?countryName=' + countryName);
    return this.states;
  }

  getAllCities(stateName: string): Observable<City[]> {
    this.cities = this.httpclient.get<City[]>(this.baseUrl + 'data/getCities?stateName=' + stateName);
    return this.cities;
  }

  getExport(dataType: string): Observable<Blob> {
    const headers = new HttpHeaders().set("Access-Control-Allow-Origin", '*');
		return this.httpclient.get(this.baseUrl + "data/generateXcel/" + dataType, { headers, responseType: 'blob' });
   }

   getProductCategories(): Observable<ProductCategory[]> {
    return this.httpclient.get<ProductCategory[]>(this.baseUrl + "data/getCategory");
   }

}
